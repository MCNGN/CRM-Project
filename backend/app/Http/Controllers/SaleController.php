<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Contact;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with('contact')->get();
        return response()->json($sales);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'recipient' => 'required|string|max:255',
            'amount' => 'required|numeric',
        ]);

        $contact = Contact::where('name', $request->recipient)->firstOrFail();

        $sale = new Sale($request->all());
        $sale->contact_id = $contact->id;
        $sale->save();

        return response()->json($sale, 201);
    }

    public function show($id)
    {
        $sale = Sale::with('contact')->findOrFail($id);
        return response()->json($sale);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'date' => 'sometimes|required|date',
            'recipient' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric',
        ]);

        $sale = Sale::findOrFail($id);

        if ($request->has('recipient')) {
            $contact = Contact::where('name', $request->recipient)->firstOrFail();
            $sale->contact_id = $contact->id;
        }

        $sale->update($request->all());
        return response()->json($sale);
    }

    public function destroy($id)
    {
        $sale = Sale::findOrFail($id);
        $sale->delete();
        return response()->json(null, 204);
    }

    public function getDashboardData()
    {
        // Calculate sales data for the last 4 months
        $salesData = [];
        for ($i = 4; $i >= 0; $i--) {
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();
            $sales = Sale::whereBetween('date', [$monthStart, $monthEnd])->sum('amount');
            $salesData[] = [
                'month' => $monthStart->format('F Y'),
                'sales' => $sales,
            ];
        }

        // Get recent sales
        $recentSales = Sale::with('contact')
            ->orderBy('date', 'desc')
            ->take(3)
            ->get()
            ->map(function ($sale) {
                return [
                    'customer' => $sale->contact->name,
                    'amount' => '$' . number_format($sale->amount, 2),
                    'date' => $sale->date,
                ];
            });

        // Calculate stats
        $totalRevenue = Sale::sum('amount');
        $lastMonthRevenue = Sale::whereBetween('date', [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()])->sum('amount');
        $newCustomers = Contact::where('created_at', '>=', Carbon::now()->subMonth())->count();
        $activeUsers = Contact::whereHas('sales', function ($query) {
            $query->where('date', '>=', Carbon::now()->subMonth());
        })->count();

        $stats = [
            [
                'title' => 'Total Revenue',
                'value' => '$' . number_format($totalRevenue, 2),
                'description' => $this->calculatePercentageChange($totalRevenue, $lastMonthRevenue) . ' from last month'
            ],
            [
                'title' => 'New Customers',
                'value' => $newCustomers,
                'description' => $this->calculatePercentageChange($newCustomers, Contact::where('created_at', '>=', Carbon::now()->subMonths(2)->startOfMonth())->where('created_at', '<', Carbon::now()->subMonth()->startOfMonth())->count()) . ' from last month'
            ],
            [
                'title' => 'Active Users',
                'value' => $activeUsers,
                'description' => $this->calculatePercentageChange($activeUsers, Contact::whereHas('sales', function ($query) {
                    $query->where('date', '>=', Carbon::now()->subMonths(2)->startOfMonth())->where('date', '<', Carbon::now()->subMonth()->startOfMonth());
                })->count()) . ' from last month'
            ],
        ];

        // Calculate customer lifetime value
           $customerLifetimeValue = '$' . number_format(Sale::avg('amount') * Contact::count(), 2);

        // Calculate customer segments
        $customerSegments = [
            ['segment' => 'High Value', 'count' => Contact::whereHas('sales', function ($query) {
                $query->where('amount', '>', 500);
            })->count()],
            ['segment' => 'Medium Value', 'count' => Contact::whereHas('sales', function ($query) {
                $query->whereBetween('amount', [100, 500]);
            })->count()],
            ['segment' => 'Low Value', 'count' => Contact::whereHas('sales', function ($query) {
                $query->where('amount', '<', 100);
            })->count()],
        ];

        return response()->json([
            'salesData' => $salesData,
            'recentSales' => $recentSales,
            'stats' => $stats,
            'customerLifetimeValue' => $customerLifetimeValue,
            'customerSegments' => $customerSegments,
        ]);
    }

    private function calculatePercentageChange($current, $previous)
    {
        if ($previous == 0) {
            return '+100%';
        }

        $change = (($current - $previous) / $previous) * 100;
        return ($change >= 0 ? '+' : '') . number_format($change, 1) . '%';
    }
}