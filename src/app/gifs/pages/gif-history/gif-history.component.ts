import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal   } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GifsService } from '../../services/gifs.service';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
@Component({
  selector: 'app-gif-history',
  templateUrl: './gif-history.component.html',
  styleUrls: ['./gif-history.component.css'],
  imports: [GifListComponent]
})
export default class GifHistoryComponent implements OnInit {

  gifsService = inject(GifsService);
  
  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map((params) => params['query']),
    )
  )

  gifsByKey = computed(() => {
    return this.gifsService.getHistoryGifs(this.query() ?? '');
  });

  constructor() { }

  ngOnInit() {
  }

}
