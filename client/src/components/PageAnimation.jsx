/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion"

const PageAnimation = ({
 children,
 keyValue,
 className,
 transition = { duration: 0.5 },
 initial = { opacity: 0 },
 animate = { opacity: 1 }
}) => (
 <AnimatePresence>
  <motion.div
   key={keyValue}
   initial={initial}
   animate={animate}
   transition={transition}
   className={className}
  >
   {children}
  </motion.div>
 </AnimatePresence>
)

export default PageAnimation