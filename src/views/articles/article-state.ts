import { GitPath } from "@enchanterjs/enchanter/lib/git-path"
import { GitFileStore } from "@enchanterjs/enchanter/lib/git-file-store"
import postmark, { Nodes } from "@xieyuheng/postmark"
import { Book } from "@cicada-lang/cicada/lib/book"
const Path = require("path")

export class ArticleState {
  articleId: GitPath
  files: GitFileStore
  text: string
  pageName: string
  book: Book

  constructor(opts: {
    articleId: GitPath
    files: GitFileStore
    text: string
    pageName: string
    book: Book
  }) {
    this.articleId = opts.articleId
    this.files = opts.files
    this.text = opts.text
    this.pageName = opts.pageName
    this.book = opts.book
  }

  static async build(opts: { articleId: string }): Promise<ArticleState> {
    const articleId = GitPath.decode(opts.articleId)
    const files = articleId.upward().createGitFileStore()
    const text = await files.getOrFail(Path.basename(articleId.path))
    const pageName = articleId.path
    const book = await app.cicada.gitBooks.fake({
      fallback: files,
      faked: { [pageName]: text },
    })
    return new ArticleState({ articleId, files, text, pageName, book })
  }

  get document(): Nodes.Document {
    return app.postmarkParser.parseDocument(this.text)
  }
}
