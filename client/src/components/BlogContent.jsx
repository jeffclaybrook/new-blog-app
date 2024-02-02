/* eslint-disable react/prop-types */

const Image = ({ url, caption }) => (
 <div>
  <img src={url} alt={caption} />
  {caption.length && (
   <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">{caption}</p>
  )}
 </div>
)

const Quote = ({ quote, caption }) => (
 <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
  <p className="text-xl leading-10 md:text-2xl">{quote}</p>
  {caption.length && (
   <p className="w-full text-purple text-base">-{caption}</p>
  )}
 </div>
)

const List = ({ style, items }) => (
 <ol className={`pl-5 ${style == "ordered" ? "list-decimal" : "list-disc"}`}>
  {items.map((item, i) => (
   <li key={i} dangerouslySetInnerHTML={{ __html: item }} className="my-4" />
  ))}
 </ol>
)

const BlogContent = ({ block }) => {
 let { type, data } = block
 if (type == "paragraph") {
  return <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
 }
 if (type == "image") {
  return <Image url={data.file.url} caption={data.caption} />
 }
 if (type == "quote") {
  return <Quote quote={data.text} caption={data.caption} />
 }
 if (type == "list") {
  return <List style={data.style} items={data.items} />
 }
 if (type == "header") {
  if (data.level == 3) {
   return <h3 dangerouslySetInnerHTML={{ __html: block.data.text }} className="text-3xl font-bold" />
  }
  return <h2 dangerouslySetInnerHTML={{ __html: block.data.text }} className="text-4xl font-medium" />
 }
}

export default BlogContent