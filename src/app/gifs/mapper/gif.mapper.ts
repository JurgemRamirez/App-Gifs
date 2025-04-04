import { GiphyItem } from "../interfaces/giphy.interface";
import { Gif } from "../interfaces/git.interface";

export class GifMapper {
  static mapGiphyItemToGif(item: GiphyItem): Gif {
    return {
      id: item.id,
      title: item.title,
      url: item.images.original.url,
    };
  }

  static mapGiphyItemsToGifArray(items: GiphyItem[]): Gif[] {
    return items.map((item) => this.mapGiphyItemToGif(item));
  }
}