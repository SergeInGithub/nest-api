import { Category } from '../schemas/book.schema';

export class UpdateBookDto {
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly author: string;
  readonly category: Category;
}
