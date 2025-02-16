<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        $activities = Activity::with('contact')->get();
        return response()->json($activities);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|string|max:255',
            'contact_id' => 'required|exists:contacts,id',
        ]);

        $activity = Activity::create($request->all());
        return response()->json($activity, 201);
    }

    public function show($id)
    {
        $activity = Activity::with('contact')->findOrFail($id);
        return response()->json($activity);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'message' => 'sometimes|required|string',
            'type' => 'sometimes|required|string|max:255',
            'contact_id' => 'sometimes|required|exists:contacts,id',
        ]);

        $activity = Activity::findOrFail($id);
        $activity->update($request->all());
        return response()->json($activity);
    }

    public function destroy($id)
    {
        $activity = Activity::findOrFail($id);
        $activity->delete();
        return response()->json(null, 204);
    }

    public function getActivitiesByTypeAndContact($contactId, $type)
    {
        $activities = Activity::where('type', $type)
            ->where('contact_id', $contactId)
            ->with('contact')
            ->get();
        return response()->json($activities);
    }
}
