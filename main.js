function query(page) {

  if (page==undefined || page==null) page=1;

  localStorage.setItem('sort', document.getElementById('sort').value);
  localStorage.setItem('perpage', document.getElementById("perpage").value);
  localStorage.setItem('not', document.getElementById('not').checked?"true":"false");
  localStorage.setItem('tag', document.getElementById('tag').value);
  localStorage.setItem('search', document.getElementById('search').value);

  document.getElementById("pages").innerHTML = "";
  document.getElementById("updatetime").innerHTML = "";
  document.getElementById("towers").innerHTML = "正在加载中... 请稍后";
  
  var formData = new FormData();
  formData.append('type', 'all');
  formData.append('sort', document.getElementById('sort').value);
  formData.append('page', page);
  formData.append('perpage', document.getElementById("perpage").value);
  formData.append('not', document.getElementById('not').checked?"not":"");
  formData.append('tag', document.getElementById('tag').value);
  formData.append('text', document.getElementById('search').value);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://ckcz123.com/games/upload.php");

  xhr.onload = function() {
    if (xhr.status==200) {
        var data = JSON.parse(xhr.response);
        var page = data.page, pages = data.pages, updatetime = data.updatetime;
        var html = "";
        data.data.forEach(function(one) {

            var text='', textcss='';
            if (one.text!='') {
                text=one.text;
                textcss='bottom: 50px';
            }

            html +='<div class="towerTab" onclick="window.open(\''
                + one.link + '\', \'_blank\')"><p>' + one.title + '<span class="towerAuths"><span class="towerAuth">'
                + one.author + "</span>";
            if (one.author2!='') html += '<span class="towerAuth2">/' + one.author2 + '</span>';
            html+='</span><span class="towerTag">' + one.tag.replace(/\|/g,"&nbsp;") + '</span></p>';
            html+='<p class="towerInfo" style="'+textcss+'">'+one.content.replace(/\n/g, '<br>')+'</p>';
            html+='<p class="towerAuthString">'+one.text+"</p></div>\n";
        });
        var pg = "";
        if (pages>1) {
          if (page!=1)
            pg+='<span style="color: rgb(0,4,255); cursor: pointer" onclick="query('+(page-1)+')">上一页</span>';
          for (var i=1;i<=pages;i++) {
              if (i==page)
                  pg+='<span>'+i+'</span>';
              else 
                  pg+='<span style="color: rgb(0,4,255); cursor: pointer" onclick="query('+i+')">'+i+'</span>';
          }
          if (page!=pages)
              pg+='<span style="color: rgb(0,4,255); cursor: pointer" onclick="query('+(page+1)+')">下一页</span>';
        }
        
        
        document.getElementById("towers").innerHTML = html;
        document.getElementById("pages").innerHTML = pg;
        document.getElementById("pages2").innerHTML = pg;
        document.getElementById("updatetime").innerHTML = "更新时间："+updatetime;

        window.scrollTo(0,0);

    }
    else {
        towers.innerHTML = "加载失败，HTTP "+xhr.status;
    }
  }
  xhr.ontimeout = function() {
    document.getElementById("towers").innerHTML = "加载失败，超时";
  }
  xhr.onabort = function() {
    document.getElementById("towers").innerHTML = "加载失败，中断";
  }
  xhr.onerror = function() {
    document.getElementById("towers").innerHTML = "加载失败，错误";
  }
  xhr.send(formData);
}

function load(key, defaultValue) {
  var value=localStorage.getItem(key);
  if (value==undefined || value==null) return defaultValue;
  return value;
}

(function() {

  var background = document.getElementById('background');
    var resize = function(){
      
      var ratio = window.devicePixelRatio || 1;
      var dc=background.getContext('2d');
      
      background.width = innerWidth*ratio;
      background.height = innerHeight*ratio;
      dc.scale(ratio, ratio);
  
      var bsize=32;
      var fullWidth=~~((innerWidth-17)*ratio);
      var fullHeight=~~(innerHeight*ratio);
      
      var fullX=~~(fullWidth/bsize)-1;
      var fullY=~~(fullHeight/bsize)-1;
  
      var colorA=["#f9f9f9","#fdfdfd"];
      var colorIndex =1;
      for(ii=0;ii<=fullX+1;ii++){
        colorIndex=ii%2;
        for(jj=0;jj<=fullY+1;jj++){
          dc.fillStyle=colorA[colorIndex];
          if(Math.random()<0.03)dc.fillStyle='#'+'ef'[~~(Math.random()*2)]+''+'ef'[~~(Math.random()*2)]+''+'ef'[~~(Math.random()*2)];
          colorIndex=1-colorIndex;
          dc.fillRect(ii*bsize,jj*bsize,bsize,bsize);
        }
      }
    };
    resize();
    window.onresize = resize;

  document.getElementById('sort').value=load('sort', 'score desc');
  document.getElementById('not').checked=JSON.parse(load('not', 'false'));
  document.getElementById('tag').value=load('tag', '');
  document.getElementById('search').value=load('search', '');
  document.getElementById('perpage').value=load('perpage', '20');
  document.getElementById('perpage2').value=load('perpage', '20');

  query();
})();
