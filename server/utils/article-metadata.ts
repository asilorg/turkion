import type { MinimarkNode } from 'minimark'

interface ArticleMetadata {
  path?: string
  sources?: { title: string, url: string }[]
  editorialStatus?: 'draft' | 'reviewed'
  updatedAt?: string
}

const labels = {
  en: { sources: 'References', status: 'Editorial status', draft: 'Draft', reviewed: 'Reviewed', updated: 'Updated' },
  ru: { sources: 'Источники', status: 'Редакционный статус', draft: 'Черновик', reviewed: 'Проверено', updated: 'Обновлено' },
  uz: { sources: 'Manbalar', status: 'Tahrir holati', draft: 'Qoralama', reviewed: 'Tekshirilgan', updated: 'Yangilangan' }
}

export function articleMetadataNodes(article: ArticleMetadata): MinimarkNode[] {
  const locale = article.path?.split('/')[1] as keyof typeof labels
  const text = labels[locale] || labels.en
  const nodes: MinimarkNode[] = []
  if (article.editorialStatus) nodes.push(['p', {}, `${text.status}: ${text[article.editorialStatus]}`])
  if (article.updatedAt) nodes.push(['p', {}, `${text.updated}: ${article.updatedAt}`])
  if (article.sources?.length) {
    nodes.push(['h2', {}, text.sources])
    nodes.push(['ul', {}, ...article.sources.map((source): MinimarkNode => ['li', {}, ['a', { href: source.url }, source.title]])])
  }
  return nodes
}
