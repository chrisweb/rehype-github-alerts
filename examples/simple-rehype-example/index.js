import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
//import rehypeDocument from 'rehype-document'
//import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import { read } from 'to-vfile'
import { reporter } from 'vfile-reporter'
import { rehypeGithubAlerts } from '../../dist/index.js'

const start = async () => {

    const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeGithubAlerts)
        .use(rehypeStringify)
        .process(await read('content.md'))

    console.error(reporter(file))
    console.log(String(file))
}

start()