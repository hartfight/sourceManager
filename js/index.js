 window.onload = function() {
	
	
	//获取目录树字符串
 	function getListStr(contentObj) {
 		var resultContent = "";
 		for(var title in contentObj) {
 			var obj = contentObj[title];
 			var treeLine = '', //连接线
 				treeType = '', //文件或者文件夹
 				childrenStr = '';

 			if(obj.type == 'file') {
 				//判断是否是最后元素
 				if(obj.last == true) {
 					treeLine = "mini-tree-lline";
 				} else {
 					treeLine = "mini-tree-nline";
 				}
 				treeType = "mini-tree-file";
 			} else {
 				if(obj.state === 'closed') {
 					treeLine = obj.last == true ? "mini-tree-cline-last" : "mini-tree-cline";
 					treeType = "mini-tree-folder";
 				} else {
 					treeLine = obj.last == true ? "mini-tree-eline-last" : "mini-tree-eline";
 					treeType = "mini-tree-ofolder";
 					childrenStr = "<ul>" + getListStr(obj.children) + "</ul>";

 				}

 			}
 			//遍历对象
 			var indentSpan = '';
 			for(var i = 0; i < obj.paths.split('/').length - 1; i++) {
 				indentSpan += '<span class="mini-tree-indent"></span>'
 			}

 			resultContent += '<li><div class="mini-tree-node" title=' + obj.paths + '>' + indentSpan + '<span class="mini-tree-line ' + treeLine + '"></span><span class="mini-tree-nodeshow"><span class="' + treeType + ' mini-tree-icon"></span><span class="min-tree-ntitle">' + title + '</span></span></div>' + childrenStr + '</li>';

 		}

 		return resultContent;
 	}

 	//刷新数据，给节点添加方法。
 	function refreshDataEve() {
 		var sourceList = document.querySelector("#sourceList");
 		sourceList.innerHTML = getListStr(appData);
 		//tree节点，
 		var treeNodes = document.querySelectorAll('.mini-tree-node');
 		console.log(treeNodes);

 		//给节点添加单击方法
 		treeNodes.forEach(function(ele) {
 			ele.addEventListener('click', function(eve) {
 				eve = eve || window.event;
 				var treeNode = eve.currentTarget;
 				var nodeObj = getObject(treeNode.title);

 				if(nodeObj.type == 'file') {
 					alert('这是一个文件不是文件夹，无法打开');
 				} else if(nodeObj.type == 'folder') {
 					nodeObj.state = nodeObj.state === 'open' ? "closed" : "open";
 					refreshContent(nodeObj);
 					refreshDataEve();
 				}
 				closeMenu();

 			})
 		})
 	}

 	//刷新content区域函数
 	function refreshContent(contentObj) {
 		var objs = contentObj.children;
 		var fcontainer = document.querySelector('#fcontainer');
 		//添加资源路径
 		fcontainer.title = contentObj.paths;

 		var strHtml = "";
 		for(var name in objs) {
 			var obj = objs[name];
 			var itemType = '';
 			if(obj.type === "folder") {
 				itemType = 'content-folder-icon';
 			} else if(obj.type === 'file') {
 				itemType = 'content-file-icon';
 			}
 			strHtml += '<li class="content-item"  title=' + obj.paths + '><span class="content-icon ' + itemType + '"></span><span class="content-title">' + name + '</span><input type="checkbox" class="content-selected-item"/></li>'
 		}

 		fcontainer.innerHTML = strHtml;
 		addContentEvent();
 	}

 	//content容器内容添加content-item添加方法
 	function addContentEvent() {
 		var fcontainer = document.querySelector('#fcontainer');
 		var folderSource = document.querySelector(".folder-source");
 		//去掉默认的contextmenu事件，否则会和右键事件同时出现。
 		folderSource.oncontextmenu = function(e) {
   			e.preventDefault();
 		};

 		folderSource.addEventListener("mousedown", function(event) {
 			event = event || window.event;
 			if(event.button === 0) {
 				console.log('folder左单击！');
 				closeMenu();
 			} else if(event.button === 2) {
 				console.log('folder右单击！');
 				openMenu(event);
 			}
 		});
 		var items = fcontainer.querySelectorAll('.content-item');
 		items.forEach(function(elen) {
 			elen.addEventListener('mousedown', function(event) {
 				event = event || window.event;
 				console.log(event);
 				if(event.button === 0) {
 					console.log('item左单击！');
 					
 					var nodeObj = getObject(this.title);
 					var itemCheck = this.querySelector('.content-selected-item');
 					
 					if(nodeObj.type == 'file' && itemCheck.checked == false) {
 						alert('这是一个文件不是文件夹，无法打开');
 					} else if(nodeObj.type == 'folder' && itemCheck.checked == false) {
 						refreshContent(nodeObj);
 						refreshDataEve();
 					}
 					closeMenu();
 					
 					//添加鼠标移动事件
 					if(itemCheck.checked){
 						moveItem(event);
 					}
 					

 				} else if(event.button === 2) {
 					console.log('item右单击！');
 					openMenu(event);
 				}
 				window.event ? window.event.cancelBubble = true : event.stopPropagation();
 			});
 			elen.addEventListener('mouseup',function(event){
 				window.event ? window.event.cancelBubble = true : event.stopPropagation();
 			})
 			
 			
 		})
 		
 		var selectItems= fcontainer.querySelectorAll('.content-selected-item');
		selectItems.forEach(function(elen){
//			elen.onfocus
			elen.addEventListener("mousedown" ,function(event){
				event = window.event || event;
				event.preventDefault();
				this.checked = !this.checked;
				console.log(this);
				window.event ? window.event.cancelBubble = true : event.stopPropagation();
			});
		});
 	}
 	//调用方法。
 	refreshDataEve();
 	//调用刷新content区域函数
 	refreshContent(appData.myComputer);

 	//菜单操作
 	function openMenu(event) {
 		console.log('openMenu');
 		var menubox = document.querySelector('.context-menu');
 		menubox.style.display = 'block';
 		menubox.style.left = event.layerX + 'px';
 		menubox.style.top = event.layerY + 'px';

 		var items = menubox.querySelectorAll('li');
 		//0 是打开，  1 删除，  2 重命名， 3 新建文件， 4新建文件夹
 		for(var i = 0; i < items.length; i++) {
 			items[i].className = "disable";
 			items[i].onmousedown = '';

 		}

 		if(event.currentTarget.title === '') {
 			items[3].className = '';
 			items[3].onmousedown = newfile;
 			items[4].className = '';
 			items[4].onmousedown = newfolder

 		} else {
 			var currentEle = event.currentTarget;
 			var paths = currentEle.title;
 			var obj = getObject(paths);
			for (var i = 0; i<3;i++) {
				items[i].domEle = currentEle;
			}
 			if(obj.type == 'folder') {
 				items[0].className = '';
 				items[0].onmousedown = openfolder;
 			}
 			items[1].className = '';
 			items[1].onmousedown = deleteNode
 			items[2].className = '';
 			items[2].onmousedown = rename
 		}

 	}

 	function closeMenu() {
 		var menubox = document.querySelector('.context-menu');
 		menubox.style.display = 'none';
 	}

 	//通过paths获取 对象
 	function getObject(path) {
 		var paths = path.split('/');
 		var nodeObj = appData[paths[0]];
 		for(var i = 1; i < paths.length; i++) {
 			var nodeObj = nodeObj.children[paths[i]];
 		}
 		return nodeObj;
 	}

 	//打开
 	function openfolder(event) {
		var paths = this.domEle.title;
		var nodeObj = getObject(paths);
		nodeObj.state = 'open';
		refresh(event,nodeObj);
 	}
 	//删除节点
 	function deleteNode(event) {
		console.log("deleteNode");
		var nodeObj = delTreeNode(this.domEle.title);		
		refresh(event,nodeObj);
 	}
 	//重命名
 	function rename(event) {
		console.log("rename");
		
		//清除重命名之前样式
		clearRename();
		
		var currentNode = this.domEle;
		var titleNode = currentNode.querySelector('.content-title');		
		console.log(titleNode);
		var title = titleNode.innerText;		
		titleNode.innerHTML = '<input class="rename" type="text"  value="'+title+'" /> <button class="confirm">√</button><button class="cancel">×</button>';
		titleNode.querySelector('.rename').onmousedown = function(eve){
			console.log("input rename");
			window.event ? window.event.cancelBubble = true : eve.stopPropagation();
		}
		//确定认修改
		titleNode.querySelector('.confirm').onmousedown = function(eve){
			console.log("input 确认");
			var newName = titleNode.querySelector('.rename').value;
			var paths = currentNode.title.split('/');
			var oldName = paths.pop();
			var nodeObje = getObject(paths.join("/"));
			var children = getObject(currentNode.title);
			//添加节点
			children.paths = paths.join("/")+"/"+newName;
			nodeObje.children[newName] = children;
			//删除以节点
			if (oldName != newName) {
				delTreeNode(currentNode.title);
			}
			
			
			refresh(eve,nodeObje);
		}
		//取消修改重命名
		titleNode.querySelector('.cancel').onmousedown = function(eve){
			console.log("input cancel");
			clearRename();
			window.event ? window.event.cancelBubble = true : eve.stopPropagation();
		}
		
		
 	}
 	//新建文件
 	function newfile(event) {
 		var paths = document.querySelector('#fcontainer').title;
 		var nodeObj = getObject(paths);
 		var num = 0;
 		for(var title in nodeObj.children) {
 			nodeObj.children[title].last = false;
 		}
 		while(true) {
 			var name = "新建文件" + num ;
 			if(!nodeObj.children[name]) {
 				nodeObj.children[name] = {
 					"id": 12,
 					"type": "file",
 					"paths": paths + '/' + name,
 					"last": true
 				}
 				break;
 			}
 			num++;
 		}

 		refresh(event,nodeObj);
 	}
 	//新建文件夹
 	function newfolder(event) {
 		console.log('newfolder');
 		var paths = document.querySelector('#fcontainer').title;
 		var nodeObj = getObject(paths);
 		var num = 0;
 		for(var title in nodeObj.children) {
 			nodeObj.children[title].last = false;
 		}
 		while(true) {
 			var name = "新建文件夹" + num;
 			if(!nodeObj.children[name]) {
 				nodeObj.children[name] = {
 					"id": 12,
 					"type": "folder",
 					"paths": paths + '/' + name,
 					"last": true,
 					"state": "closed",
 					"children":{}
 				}
 				break;
 			}
 			num++;
 		}

 		refresh(event,nodeObj);
 	}
	 	
 	//刷新所有数据
 	function refresh(event,nodeObj){
 		//调用方法。
 		refreshDataEve();
 		//调用刷新content区域函数
 		refreshContent(nodeObj);
 		closeMenu();
 		window.event ? window.event.cancelBubble = true : event.stopPropagation();
 	}
 	
 	
 	//元素移动
 	function moveItem(event){
 		var currentNode = event.currentTarget;
 		var moveBox = document.querySelector('#content-movebox');
 		moveBox.title = currentNode.title;
 		
 		moveBox.style.display = 'block';
 		moveBox.style.left = event.layerX-20+"px";
 		moveBox.style.top = event.layerY -20+"px";
 		
 		
 		moveBox.onmousemove=function(event){
   			
			var contentBox = document.querySelector('.folder-source');
			var left = event.pageX-contentBox.offsetLeft-moveBox.clientWidth/2;
			var top = event.pageY - contentBox.offsetTop-moveBox.clientHeight/2;
			this.style.left = left+"px";
   			this.style.top = top+"px";			
 			
 		};


		document.onmouseup = function(event){
			console.log("clear");
			moveBox.style.display = 'none';
			moveBox.onmousemove =null;
			var clientX = event.clientX;
			var clientY = event.clientY;
			
			var items = document.querySelector("#fcontainer").querySelectorAll(".content-item");			
			for (var i = 0; i < items.length; i++) {
				
				var rect = items[i].getBoundingClientRect();
				//目标文件
				var nodeObj = getObject(items[i].title);
				
				if((clientX>rect.x&&clientX<rect.x+rect.width)&&(clientY>rect.y&&clientY<rect.y+rect.height)){			
					if(nodeObj.type === 'folder'){
						//移动对象
						 var moveObj = getObject(moveBox.title);
						 //在当前
						 delTreeNode(moveBox.title);
						 //添加子节点
						 var subName = moveBox.title.split("/").pop();
						 moveObj.paths = nodeObj.paths + "/"+subName;
						 
						 //修改路径
						setPath(moveObj);					 
						 
						 nodeObj.children[subName] = moveObj;
						//调用方法。
 						refreshDataEve();
 						//调用刷新content区域函数
 						refreshContent(nodeObj);
					}else if(nodeObj.type === 'file'){
						alert("无法移动到文件中");
					}
					
				}
			}
			
			
		}
 		
 		
 	}
 	
 	
 	//删除元素节点
 	function delTreeNode(path){
 		var paths = path.split('/');
		var nodeObj = appData[paths[0]];
 		for(var i = 1; i < paths.length-1; i++) {
 			var nodeObj = nodeObj.children[paths[i]];
 		}

		var deleteName = paths[paths.length -1];
		var childrens = nodeObj.children;
		nodeObj.children = {};
		var lastName = '';
		for(var pName in childrens){
			if(pName != deleteName){
				nodeObj.children[pName] = childrens[pName];
				lastName = pName;
			}			
		}
		if(lastName != ''){
			nodeObj.children[lastName].last=true;
		} 
		return nodeObj;
 	}
 	
 	//清除重名
 	function clearRename(){
 		var items = document.querySelector('#fcontainer').querySelectorAll('.content-item');
		items.forEach(function(item){
			var rename = item.querySelector('.rename');
			if(rename){
				item.querySelector('.content-title').innerHTML = rename.value;
			}
			
		});
 	}
 	
 	
 	//修改路径
 	function setPath(nodeObj){
 		
 		if(nodeObj.children){	
 			for(var keyName in nodeObj.children){
 				var node = nodeObj.children[keyName];
 				node.paths = nodeObj.paths + "/"+keyName;
 				if(node.children){
 					setPath(node);
 				}
 			}					
 		}
 	}
 	
 	
 	
 }