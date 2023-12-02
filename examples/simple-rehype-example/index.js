import { unified } from 'unified'
import remarkParse from 'remark-parse'
//import remarkGfm from 'remark-gfm'
//import remarkBreaks from 'remark-breaks'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { read } from 'to-vfile'
import { reporter } from 'vfile-reporter'
import { rehypeGithubAlerts } from '../../dist/index.js'

const start = async () => {

    const file = await unified()
        .use(remarkParse)
        // if you are using rehypeGithubAlerts you probably want
        // to enable the next two plugins too, but they are optional
        //.use(remarkGfm)
        //.use(remarkBreaks)
        .use(remarkRehype)
        .use(rehypeStringify)
        .use(rehypeGithubAlerts)
        .process(await read('content.md'))

    console.error(reporter(file))
    console.log(String(file))
}

start()