
export async function getFavorite (setFavArr: (value: React.SetStateAction<any[]>) => void) {
    const res = await fetch('/api/favorite/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) {
      const result = await res.json();
      setFavArr(result.favoriteObjects);
    }
}




export async function addToFavorite(id:string, setFavArr: (value: React.SetStateAction<any[]>) => void) {
    const res = await fetch('/api/favorite/add/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
        getFavorite(setFavArr);
    }
}


export async function deleteFavorite(id:string, setFavArr: (value: React.SetStateAction<any[]>) => void) {
    const res = await fetch('/api/favorite/delete/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
        getFavorite(setFavArr);
    }
}