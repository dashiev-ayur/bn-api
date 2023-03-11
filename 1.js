var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var News = /** @class */ (function () {
    function News(title) {
        this.title = title;
    }
    return News;
}());
var Article = /** @class */ (function (_super) {
    __extends(Article, _super);
    function Article() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Article;
}(News));
var NewsOut = /** @class */ (function () {
    function NewsOut(row) {
        this.row = row;
    }
    NewsOut.prototype.toHtml = function () {
        return "<h1>".concat(this.row.title, "<h1>");
    };
    NewsOut.prototype.toJson = function () {
        return "{title: ".concat(this.row.title, "}");
    };
    return NewsOut;
}());
var Out = /** @class */ (function () {
    function Out() {
    }
    Out.prototype.toHtml = function () {
        return "<span/>";
    };
    Out.prototype.toJson = function () {
        return "{}";
    };
    return Out;
}());
var n1 = new News('Привет колобок...');
var n2 = new Article('Привет бармалей...');
// использование через интерфейс
var list = [new NewsOut(n1), new NewsOut(n2), new Out()];
list.forEach(function (el) {
    console.log('>>>>', el.toHtml());
    console.log('>>>>', el.toJson());
});
