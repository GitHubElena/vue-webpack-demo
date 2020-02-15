
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractTextPlugin= require("extract-text-webpack-plugin");
const env=process.env.NODE_ENV === 'production' ?'prod':'dev';
// const MinifyPlugin = require("babel-minify-webpack-plugin");
const {CleanWebpackPlugin}=require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const  autoprefixer=require('autoprefixer');
const path=require('path');

const commonStyleLoader=[
             
   {
       loader:'css-loader',
       options:{
           sourceMap:env==='dev'?true:false                       
       }
  },
  {
      loader: 'postcss-loader' ,
      options:{
        plugins:[
            autoprefixer({
                Browserslist: ['last 7 versions']
              })
        ]
      }
     
  }      
];
module.exports={  
    mode:'development',  
    entry:{
       app:'./src/main.js'
    },
    output:{
        filename:'[name][hash].js',
        path:path.resolve(__dirname,'dist')      
    },
    resolve:{
        alias:{
            "vue": 'vue/dist/vue.js',
            "@":path.resolve(__dirname,'src'),
            "@components":path.resolve(__dirname,'src/components'),
            "styles":path.resolve(__dirname,'src/assets/scss'),
            "views":path.resolve(__dirname,'src/views')
           
        },
        extensions:['.js','.vue']
    },
    
    devServer:{
        contentBase: path.join(__dirname, 'dist'),
        port:8000,
        open :true,
        compress:true,
        hot:true,     
        proxy:{
           '/api':{
               target:'http://localhost:3000',
               changeOrigin:true,
               pathRewrite:{'^/api':''}
            }
       }
    },
    devtool:env==='dev'?'inline-source-map':'source-map',  
    watchOptions:{
        aggregateTimeout:300,
        poll:1000
    },
    optimization:{      
        usedExports:env==='dev'?true:false,
        splitChunks:{
           cacheGroups:{
               vendor:{
                   test:/[\\/]node_modules[\\/]/,
                   name:'vendors',
                   chunks:'all'
               }
               
           }
        },     
        runtimeChunk:'single',     
        // minimizer:[              
        //           new TerserPlugin({
        //               sourceMap: true,               
        //               parallel: 4
        //           })

        // ]     
    },
    performance: {
        maxAssetSize: 100000
    },
    stats: {
        env: true
    },
    module:{
      rules:[
          {
             test:/\.js?$/,          
             use:[
                  'cache-loader',
                  {              
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env'],
                        plugins:['@babel/plugin-transform-runtime']
                    }
                 }             
             ],
              include:path.resolve('src'),         
              exclude:/node_modules/
          },       
          {
            test:/\.vue$/,
            use:'vue-loader',
            include:path.resolve('src'),         
            exclude:/node_modules/
            
          },        
          {
              test:/\.ts[x]?$/,
              use:'ts-loader',
              exclude:/node_modules/
          },
          {
              test:/\.css$/,
              use:ExtractTextPlugin.extract({                 
                fallback:env==='dev'?'style-loader':MiniCssExtractPlugin.loader,      
                use: [
                    ...commonStyleLoader         
                ]
        
              })
             
          },
          {
            test: /\.s[ac]ss$/,
            use:ExtractTextPlugin.extract({                 
                fallback:env==='dev'?'style-loader':MiniCssExtractPlugin.loader,      
                use: [
                    ...commonStyleLoader,
                    { 
                        loader: 'sass-loader',
                        options: { 
                           sourceMap: env==='prod'?false:true
                        }
                     }  
                ],
              
              })            
          },
          {
            test: /\.less$/,
            use:ExtractTextPlugin.extract({                 
                fallback:env==='dev'?'style-loader':MiniCssExtractPlugin.loader,    
                use: [
                        ...commonStyleLoader,
                        { 
                            loader: 'less-loader',
                            options: { 
                                paths: [
                                    path.resolve(__dirname, 'node_modules')
                                ]
                            }
                        }
                    ],
                 
              }) 
          },
          {
              test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,        
              use: [
                {
                  loader: 'url-loader',
                  options: {
                    outputPath: 'images',
                    name: '[name].[ext]',
                    limit:1024,
                    esModule: false 
                  }
                }
              ]
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                outputPath: 'media',
                name: '[name].[ext]',           
                esModule: false ,
                limit: 10000             
            }
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                outputPath: 'fonts',
                name: '[name].[ext]',  
                limit: 10000
              
            }
          }         
        
      ]
     
    },
    plugins:[
        new CleanWebpackPlugin(),       
        new HtmlWebpackPlugin({template:'./index.html'}),        
        new ExtractTextPlugin({
            filename:`[name]_[hash:8].css`
        }),
        new MiniCssExtractPlugin(),
       // new MinifyPlugin(),
        new VueLoaderPlugin()
        
        
    ]
}