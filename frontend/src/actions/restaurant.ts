'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL ?? "http://localhost:3001/api";



async function getAuthHeaders() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  return {
    'Content-Type': 'application/json',
    ...(session ? { Cookie: `session=${session}` } : {})
  };
}
/*
export async function getRestaurantById(id: number) {
  const res = await fetch(`${API_URL}/restaurants/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export async function checkSavedStatus(restaurantId: number) {
  const res = await fetch(`${API_URL}/saved/${restaurantId}/status`, {
    headers: await getAuthHeaders(),
    cache: 'no-store'
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.saved;
}
*/

export async function getRestaurantById(id: number) {
  try {
    const res = await fetch(`${API_URL}/restaurants/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Get restaurant failed:", res.status);
      return null;
    }

    const json = await res.json();

    // Backend của bạn trả về { data: restaurant }
    return json.data ?? json;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return null;
  }
}

export async function checkSavedStatus(restaurantId: number) {
  try {
    const res = await fetch(`${API_URL}/restaurants/${restaurantId}/saved-status`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return false;
    }

    const json = await res.json();

    return json.data?.isSaved ?? json.isSaved ?? false;
  } catch (error) {
    console.error("Error checking saved status:", error);
    return false;
  }
}

export async function toggleSavedRestaurant(restaurantId: number) {
  const res = await fetch(`${API_URL}/saved/${restaurantId}`, {
    method: 'POST',
    headers: await getAuthHeaders(),
  });
  
  if (res.ok) {
    revalidatePath(`/restaurant/${restaurantId}`);
    revalidatePath('/saved');
  }
  
  const data = await res.json();
  return data;
}

export async function getSavedRestaurants() {
  const res = await fetch(`${API_URL}/saved`, {
    headers: await getAuthHeaders(),
    cache: 'no-store'
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data;
}
