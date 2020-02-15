## webpack 工作原理概括 ##

- Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
- Plugin：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。

### 常用的loader ###
 
|--js方面 
   -  babel-loader   
   解析js es6语法或者 jsx语法  
   -  vue-loader   
   针对vue 模板语法进行解析  
   -  cache-loader  
   一些性能开销较大的 loader 之前添加此 loader，以将结果缓存到磁盘里  
  - eslint-loader  
   对js语法进行检查  

|--css方面
  - style-loader  
   针对解析好的css插入到head上的style里面  
  - css-loader
   针对css解析  
  - postcss-loader  
   给css添加厂商前缀  
  - scss|less-loader  
   针对scc或者less进行解析  

- ---文件或图片

.file-loader
可解析生成对应目录的文件，打包后的文件名和文件夹不变
.url-loader
也可以解析文件和图片，但打包后的文件之归纳到dist目录下，且文件名会变
但针对图片可以限制大小，小图标可以解析为base64,大图片则继续用名字
 .gzip-loader
 压缩loader

### 常用的plugin

 - babel 压缩  
 BabelMinifyWebpackPlugin  
 使用 babel-minify进行压缩,babel类库文件大大压缩体积变小  

- js压缩
 UglifyJsPlugin |TerserPlugin  
 不过具体实现也是在optimization.minimizer配置即可还可以多进程打包parallel配置即可，但目前只支持开发环境，不支持生产环境Es6语法  
 但若像支持生产环境可以用 terser-webpack-plugin  （ TerserPlugin）替换UglifyJsPlugin也是在optimization.minimizer下配置  

- common chunks
 CommonsChunkPlugin  
 webpack4中已经被splitchunksplugin代替，提取 chunks 之间共享的通用模块，减少代码量  
 具体实现在optimization.splitChunks中添加属性即可，生成vendors文件  

- css chunks
.ExtractTextWebpackPlugin
将css文件从bundle.js中单独提取出来，不过运行不同的话，需要将该插件的版本
@next 升级成 package.json文件中的 "extract-text-webpack-plugin": "^4.0.0-beta.0"一样
提取出css文件的优势：更快提前加载，因为 CSS bundle 会跟 JS bundle 并行加载。

- html 生成  
 htmlwebpackplugin  
 自动生成html文件自动导入js css文件以及其他common文件  

- CleanWebpackPlugin  
 dist文件生成前自动删除上次dist

- hmr webpack.HotModuleReplacementPlugin  
  热模块加载，热更新    

- optimization.runtimeChunk  
  将runtime code文件拆分为runtime 文件"single" 会创建一个在所有生成 chunk 之间共享的运行时文件  

- splitChunksPlugin  
  代码分割做优化  
  optimization下配置，针对公共模块切割出来，缓存一起，一个减少代码量，二不用每次加载同样的东西，也能够缓存  




### 优化总结 ###

 - 侧重优化开发体验的配置文件  

     js是单进程的，让其多进程打包happyPack打包，optimization配置下的东西执行parall多进程打包，
     文件大的拆分成多个文件有理由提高打包速度，
     文件resolve alias做文件快速索引，loader可以exclude,include快速索引loader目录  


 - 侧重优化输出质量的配置文件  

     减小体积  treeshinking (sideeffects  配合optimization下的 usedExports)没用的去掉，不导出
     压缩js css文件  TerserPlugin|mini-css-webpack-plugin  ，且css和js分离有利于并行extract-text-webpack-plugin
     splitchunksplugin代替，提取 chunks 之间共享的通用模块，减少代码量,不用每次导入相同的东西，用缓存文件，生成wendors文件
     babel文件最大，所以最先压缩此文件运行更快BabelMinifyWebpackPlugin且可以通过babel-loader无法通过的es6语法等
     cdn引入第三方类库，再配合externals设置哪些类库不需要导入且noParse这类库文件，
     压缩文件则用TerserPlugin








           


### file-loader 和url-loader各自的好处 ###

 file-loader 可以指定要复制和放置资源文件的位置，以及如何使用版本哈希命名以获得更好的缓存。此外，这意味着 你可以就近管理图片文件，可以使用相对路径而不用担心部署时 URL 的问题。使用正确的配置，webpack 将会在打包输出中自动重写文件路径为正确的 URL。    
    
 url-loader 允许你有条件地将文件转换为内联的 base-64 URL (当文件小于给定的阈值)，这会减少小文件的 HTTP 请求数。如果文件大于该阈值，会自动的交给 file-loader 处理。