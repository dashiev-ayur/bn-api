/* eslint-disable @typescript-eslint/no-unused-vars */
interface IHtml {
  toHtml(): string;
}
interface IJson {
  toJson(): string;
}
interface ITopic {
  title: string;
}
class News implements ITopic {
  title: string;
  constructor(title: string) {
    this.title = title;
  }
}
class Article extends News {}

class NewsOut implements IHtml, IJson {
  private row;
  constructor(row: News) {
    this.row = row;
  }
  toHtml(): string {
    return `<h1>${this.row.title}<h1>`;
  }
  toJson(): string {
    return `{title: ${this.row.title}}`;
  }
}
class Out implements IHtml, IJson {
  toHtml(): string {
    return `<span/>`;
  }
  toJson(): string {
    return `{}`;
  }
}

const n1 = new News('Привет колобок...');
const n2 = new Article('Привет бармалей...');

// использование через интерфейс
const list: (IHtml & IJson)[] = [new NewsOut(n1), new NewsOut(n2), new Out()];

list.forEach((el) => {
  console.log('>>>>', el.toHtml());
  console.log('>>>>', el.toJson());
});
