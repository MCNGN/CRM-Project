<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('username', 'password');

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Sign-in successful',
            'role' => $user->role,
            'accessToken' => $token,
            'id' => $user->id
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:users|string|max:255',
            'password' => 'required|string',
        ]);

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password), // Ensure password is hashed
            'role' => 'sales',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Sign-up successful',
            'user' => $user,
            'accessToken' => $token
        ], 201);
    }
}