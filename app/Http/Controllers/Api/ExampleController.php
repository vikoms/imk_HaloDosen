<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Example API Controller
 * Contoh controller untuk API yang digunakan oleh React
 */
class ExampleController extends Controller
{
    /**
     * Get all items
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // Example data - replace with actual database query
        $data = [
            ['id' => 1, 'name' => 'Item 1', 'description' => 'Description 1'],
            ['id' => 2, 'name' => 'Item 2', 'description' => 'Description 2'],
            ['id' => 3, 'name' => 'Item 3', 'description' => 'Description 3'],
        ];

        return response()->json([
            'success' => true,
            'message' => 'Data retrieved successfully',
            'data' => $data
        ]);
    }

    /**
     * Get single item by ID
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        // Example - replace with actual database query
        $item = [
            'id' => $id,
            'name' => 'Item ' . $id,
            'description' => 'Description for item ' . $id
        ];

        return response()->json([
            'success' => true,
            'message' => 'Item retrieved successfully',
            'data' => $item
        ]);
    }

    /**
     * Store a new item
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // Validate request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        // Example - replace with actual database insert
        $item = [
            'id' => rand(1, 1000),
            'name' => $validated['name'],
            'description' => $validated['description'],
            'created_at' => now()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Item created successfully',
            'data' => $item
        ], 201);
    }

    /**
     * Update existing item
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        // Validate request
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
        ]);

        // Example - replace with actual database update
        $item = [
            'id' => $id,
            'name' => $validated['name'] ?? 'Updated Item',
            'description' => $validated['description'] ?? 'Updated Description',
            'updated_at' => now()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Item updated successfully',
            'data' => $item
        ]);
    }

    /**
     * Delete an item
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        // Example - replace with actual database delete
        
        return response()->json([
            'success' => true,
            'message' => 'Item deleted successfully'
        ]);
    }

    /**
     * Search items
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');

        // Example - replace with actual database search
        $results = [
            ['id' => 1, 'name' => 'Result 1', 'description' => 'Match: ' . $query],
            ['id' => 2, 'name' => 'Result 2', 'description' => 'Match: ' . $query],
        ];

        return response()->json([
            'success' => true,
            'message' => 'Search completed',
            'data' => $results,
            'query' => $query
        ]);
    }
}
