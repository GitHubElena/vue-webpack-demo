

 function component() {
    var element = document.createElement('div');
   var button = document.createElement('button');
   var br = document.createElement('br');

   button.innerHTML = 'Click me and look at the console!';
    element.innerHTML = ('<h1>Hello, webpack </h1>');
   element.appendChild(br);
   element.appendChild(button);
    //实现懒加载功能，能在初始化页面的时候提高加快速度
   // Note that because a network request is involved, some indication
   // of loading would need to be shown in a production-level site/app.
   button.onclick = e => import('./print').then(module => {
     var print = module.default;
     console.log(_.partition([1, 2, 3, 4], n => n % 2))

     print();
   });
    return element;
   
 
  }


 document.body.appendChild(component());