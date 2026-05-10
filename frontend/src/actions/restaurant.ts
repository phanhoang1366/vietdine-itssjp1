'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = 'http://localhost:3001/api';

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
  return {
    id,
    name: "Sakura Japanese Restaurant",
    description:
      "ハノイの中心部で本格的な和食を楽しめるレストランです。落ち着いた空間で、寿司、刺身、天ぷらなどを提供しています。",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    address: "123 Kim Ma, Ba Dinh, Hanoi",
    mapImageUrl: "",
    openingHours: "10:00 - 22:00",
    budgetRange: "300K - 800K VND",
    menus: [
      {
        id: 1,
        dishNameJp: "寿司セット",
        dishNameVn: "Set sushi",
        imageUrl:
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        price: 350000,
        description: "新鮮な魚を使った人気の寿司セットです。",
        tags: ["人気", "寿司"],
      },
      {
        id: 2,
        dishNameJp: "天ぷら",
        dishNameVn: "Tempura",
        imageUrl:
          "https://images.unsplash.com/photo-1615361200141-f45040f367be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        price: 220000,
        description: "サクサクの衣で揚げた海老と野菜の天ぷらです。",
        tags: ["揚げ物"],
      },
    ],
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: "料理が美味しく、雰囲気もとても良かったです。",
        createdAt: new Date().toISOString(),
        user: {
          fullName: "Nguyen Van A",
          avatarUrl: "",
        },
      },
      {
        id: 2,
        rating: 4,
        comment: "サービスが丁寧で、また来たいと思いました。",
        createdAt: new Date().toISOString(),
        user: {
          fullName: "Tran Thi B",
          avatarUrl: "",
        },
      },
    ],
  };
}

export async function checkSavedStatus(restaurantId: number) {
  return false;
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
