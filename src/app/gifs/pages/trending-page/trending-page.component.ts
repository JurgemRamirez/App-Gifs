import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifsService } from '../../services/gifs.service';
import { ScrollStateService } from 'src/app/shared/services/scroll-state.service';


@Component({
  selector: 'app-trending-page',
  // imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent implements AfterViewInit {


  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('gruopDiv')

  gifService = inject(GifsService);
  scrollStateService = inject(ScrollStateService);

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  onscroll($event: Event) {
  const scrollDiv = this.scrollDivRef()?.nativeElement;
  if(!scrollDiv) return;

  const scrollTop = scrollDiv.scrollTop;
  const scrollHeight = scrollDiv.scrollHeight;
  const clientHeight = scrollDiv.clientHeight;

const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
this.scrollStateService.trendingScrollState.set(scrollTop);

    if(isAtBottom) {this.gifService.loadTrendingGifs();}
  }


  
  

}
