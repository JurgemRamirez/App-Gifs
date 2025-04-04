import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/git.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem('gifs') ?? '[]'; // Record<string,Gif[]>
  const gifs = JSON.parse(gifsFromLocalStorage);
  return gifs;
};


@Injectable({
  providedIn: 'root'
})
export class GifsService {

  trendingGifs = signal<Gif[]>([]);
  tendingGifsLoading = signal(false);
  private trendingPage = signal(0);

  // efecto html [gif,gif, gif], [gif,gif,gif], [gif,gif,gif]
  trendingGifGroup = computed<Gif[][]>(() => {
    const groupOfGifs = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groupOfGifs.push(this.trendingGifs().slice(i, i + 3));
    }
    return groupOfGifs;
  });

  searchHistory = signal<Record<string,Gif[]>>(loadFromLocalStorage());
  searchHistoryKey = computed(() => Object.keys(this.searchHistory()));
  

  private http = inject(HttpClient);
  
constructor() { 
  this.loadTrendingGifs();
}

saveGifsToLocalStorage  = effect(() => {
  localStorage.setItem('gifs', JSON.stringify(this.searchHistory()));
});

loadTrendingGifs(){
if(this.tendingGifsLoading()) return; // if loading is true, return

this.tendingGifsLoading.set(true);

  this.http.get<GiphyResponse>(`${environment.API_URL}/gifs/trending`,{
    params:{    
      api_key: environment.API_GIFS,
      limit: '20',
      offset: this.trendingPage() * 20
    },
  }).subscribe((response) => {
    const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
    this.trendingGifs.update(currentGifs =>[
      ...currentGifs, ...gifs
    ]); // update the signal
    this.trendingPage.update(page => page + 1);
    this.tendingGifsLoading.set(false); // set loading to false
    // console.log(gifs);
  });
  
}

searchGifs(query: string) {
 return this.http.get<GiphyResponse>(`${environment.API_URL}/gifs/search`,{
    params:{
      api_key: environment.API_GIFS,
      q: query,
      limit: '20'
    },
  })
  .pipe(
  map((response) => GifMapper.mapGiphyItemsToGifArray(response.data)),

    //TODO: HISTORIAL
tap((items) => {
  this.searchHistory.update((history) => ({
    ...history,
    [query.toLowerCase()] : items,

  }));
})

)}

getHistoryGifs(query: string) {
  return this.searchHistory()[query.toLowerCase()] ?? [];
}




}
