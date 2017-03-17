var scrollSelect = {
	//定义与初始值
	_obj : {},         type:'',         data : {},       level: 0 ,      value:[],
	tempIdx : [],      realIdx : [],    index : [],
	dataObj : [],      dataArr : [],
	warpList : [],     ulList : [],     liList : [],
	height : 0,	       start : 0,       end : 0,
	scroll : [],  top : [],        yAxis : [],
	flag : [],
	//主要方法
	go : function(param){
		//参数对象说明
		//param.data -- 传入数据json[可选(若使用日历则不需data,而使用内置的)]
		//param.level -- 传入几联(省市区为三联，日期为二联或三联);
		//param.type -- 传入的类型（暂时为省市区联动[address]和日历[calendar]）
		_obj = this;
		_obj.level = param.level;
		_obj.type = param.type;
		
		if(param.type === 'address'){
			//如果传递进来的是地址（type=address,必须传data）
			 _obj.data = param.data;
			 //从传递的el选择器中获取默认值
			$(param.elArr).each(function(index){
				_obj.value[index] = $(this).val();
			});

		}else if(param.type === 'calendar'){
			$(param.elArr).each(function(index){
				_obj.value[index] = $(this).val();
			});
			//如果传入了一个日期值：例2017-03-03
			if(_obj.value.length == 1 && param.level != 0 && _obj.value[0] !== ''){
				var matchArr = _obj.value[0].match(/[0-9]{1,4}/g);
				 for(var i =0; i<matchArr.length; i++){
					_obj.value[i] = parseInt(matchArr[i]);
				}
			}
		}
		
		//大致框架
		var $scrollSelect = $('<div class="scrollSelect"></div>'),
			$scrollTitle = $('<div class="scrollTitle"></div>'),
			$scrollContent = $('<div class="scrollContent level'+ _obj.level +'"></div>'),
			$cancel = $('<span class="cancel">取消</span>'),
			$title = $('<span class="title">请选择</span>'),
			$submit = $('<span class="submit">确定</span>');
			//title结构
			$scrollTitle.append($cancel,$title,$submit);
		//根据传入的值对三种索引进行初始赋值
		for(var i=0; i<_obj.level; i++){
			_obj.flag[i] = false;
			//填入数据
			_obj.setData(i);
			//记录重要节点
			_obj.warpList.push($('<div class="scrollWarp"></div>'));
			_obj.ulList.push($('<ul></ul>'));
			_obj.warpList[i].append(_obj.ulList[i]);
			_obj.setLilist(i);
			$scrollContent.append(_obj.warpList[i]);
		}
		//将内容添加到盒子中
		$scrollSelect.append($scrollTitle,$scrollContent)
		$('body').append($scrollSelect)
		
		//开始计算尺寸
		_obj.height = _obj.liList[0][0].height();
		for(var i=0; i<_obj.level; i++){
			_obj.top.push( (2-_obj.index[i])*_obj.height );
			//初始化高度样式
			_obj.changeCls(i);
		}
			
		//判断是否拥有移动端某个touch事件[再自定义事件赋值某端的相应事件]
		var hasTouch = 'ontouchstart' in window;
		//自定义相关事件
		var goTouchStart = hasTouch ? 'touchstart' : 'mousedown',
			goTouchMove = hasTouch ? 'touchmove' : 'mousemove',
			goTouchEnd = hasTouch ? 'touchend' : 'mouseup';	
	
		//绑定事件--按上去
		$(_obj.warpList).each(function(index){
			$(this).on(goTouchStart,function(e){
				e.preventDefault();
				_obj.flag[index] = true;
				_obj.start = hasTouch ? e.originalEvent.targetTouches[0].screenY : e.originalEvent.screenY;
			})
		})//OK
		
		//绑定事件--移动中
		$('body').on(goTouchMove,function(e){
			e.preventDefault()
			for(var i=0; i< _obj.level; i++){
				if(_obj.flag[i]){
					//获取_obj.end,并重新计算_obj.scroll
					_obj.end = hasTouch ? e.originalEvent.targetTouches[0].screenY : e.originalEvent.screenY;
					_obj.scroll[i] = _obj.top[i] + (_obj.end - _obj.start);
					//判断滚动尺寸在可滚动的范围内
					if(_obj.scroll[i] <= _obj.yAxis[i][0] && _obj.scroll[i] >= _obj.yAxis[i][_obj.dataArr[i].length-1]){
						//重新计算_obj.index索引[滚动中]
						_obj.index[i] = Math.abs( Math.floor((_obj.scroll[i]-_obj.height*2)/_obj.height+0.5) );
						//判断当在一个距离中心相对距离内[模拟贴近]
						if(_obj.scroll[i] >= _obj.yAxis[i][_obj.index[i]]-_obj.height*0.125 && _obj.scroll[i] <= _obj.yAxis[i][_obj.index[i]] + _obj.height*0.125){
							_obj.ulList[i].css('top',_obj.yAxis[i][_obj.index[i]]);
						}else{
							_obj.ulList[i].css('top',_obj.scroll[i]);
						}
						//添加active秘wait样式
						if(_obj.tempIdx[i] !== _obj.index[i]){
							//修改样式
							_obj.changeCls(i);
						}
						_obj.tempIdx[i] = _obj.index[i];
					}
				}
			}
		})//OK
		
		//绑定事件--离开
		$(document).on(goTouchEnd,function(e){
			e.preventDefault()
			for(var i=0; i< _obj.level; i++){
				if(_obj.flag[i]){
					_obj.flag[i] = false;
					_obj.top[i] = _obj.yAxis[i][_obj.index[i]];
					_obj.ulList[i].css('top',_obj.top[i])
					//判断索引是否变化再触发数据更新
					if(_obj.realIdx[i] !== _obj.index[i]){
						_obj.resetData(i);
					}
					_obj.realIdx[i] = _obj.index[i];
				}
			}
		})//OK
		
		//取消时将弹窗关闭
		$cancel.on(goTouchStart,function(){
			_obj.resetAll();
			$scrollSelect.remove()
		})
		
		//确认按钮将数据填充进来
		$submit.on(goTouchStart,function(){
			//根据类型不同，返回的数据也可能不同
			var str ='';
			if(param.type === 'address'){
				$(param.elArr).each(function(index){
					str += _obj.value[index];
					$(this).val(_obj.value[index]);
				})
//				$(param.el).html(str).removeClass('gray');
				
			}else if(param.type === 'calendar'){
				for(var i = 0; i < _obj.value.length; i++){
					str += _obj.value[i];
				}
//				$(param.el).html(str).removeClass('gray');
				$(param.elArr).val(str.replace(/[年月日]/g,'-').substring(0,str.length-1));
			}
			//清空对象相关数据
			_obj.resetAll();
			$scrollSelect.remove();
		})
	},
	resetAll:function(){
		_obj.tempIdx = [];
		_obj.realIdx = [];
		_obj.index = [];
		_obj.value = [];
		_obj.height = 0;
		_obj.start = 0;
		_obj.end = 0;
		_obj.scroll = [];
		_obj.top = [];
		_obj.yAxis = [];
	},
	//组织数据格式为：[{code:xxx,address:xxx},...]
	setKey : function(obj){
		var newArr = [];
		for(var key in obj){
			var tempObj = {};
			tempObj['code'] = key;
			tempObj['address'] = obj[key];
			newArr.push(tempObj);
		}
		return newArr;
	},
	//组织数据格式为：{code:address,...}
	setObj : function(arr){
		var newObj = {};
		for(var i=0; i < arr.length; i++){
			newObj[arr[i].code] = arr[i].address;
		}
		return newObj;
	},
	//Y值位置数组
	siteArr : function(arrLen,size){
		var newArr = [];
		for(var i=0; i<arrLen; i++){
			newArr.push((2-i)*size)
		}
		return newArr;
	},
	//添加liList
	setLilist : function(i){
		_obj.liList[i] = [];
		for(var j=0; j < _obj.dataArr[i].length; j++){
			if(_obj.type === 'address'){
				_obj.liList[i].push($('<li>'+_obj.dataArr[i][j].address+'</li>'));
			}else if(_obj.type === 'calendar'){
				_obj.liList[i].push($('<li>'+_obj.dataArr[i][j]+'</li>'));
			}
		}
		_obj.ulList[i].html(_obj.liList[i]);
	},
	//添加数据
	setData : function(i){
		if(_obj.type == 'address'){
			switch(i){
				case 0:
					_obj.dataArr[i] = _obj.data['86'];
					_obj.dataObj[i] = _obj.setObj(_obj.dataArr[i]);
					if(_obj.index[i] === undefined) _obj.setAddressIndex(i,_obj.dataArr[i]);
					break;
				default:
					_obj.dataObj[i] = _obj.data[_obj.dataArr[i-1][_obj.index[i-1]].code];
					_obj.dataArr[i] = _obj.setKey(_obj.dataObj[i]);
					if(_obj.index[i] === undefined) _obj.setAddressIndex(i,_obj.dataArr[i]);
			}
		}else if(_obj.type == 'calendar'){
			switch(i){
				case 0:
					_obj.dataArr[i] = _obj.setYear(1990);
					if(_obj.index[i] === undefined) _obj.setDateIndex(i,_obj.dataArr[i]);
					break;
				case 1:
					_obj.dataArr[i] = _obj.setMonth();
					if(_obj.index[i] === undefined) _obj.setDateIndex(i,_obj.dataArr[i]);
					break;
				case 2:
					_obj.dataArr[i] = _obj.setDay();
					if(_obj.index[i] === undefined) _obj.setDateIndex(i,_obj.dataArr[i]);
					break;
			}
		}
	},
	
	//设置日历数据
	setYear:function(start){
		var getDate = new Date();
		var thisYear = getDate.getFullYear();
		var arr=[];
		while(start <= thisYear){
			arr.push(start+'年')
			start++;
		}
		return arr;
	},
	setMonth:function(){
		var arr = [];
		for(var i = 1; i <= 12 ;i++){
			arr.push(i+'月')
		}
		return arr;
	},
	setDay:function(){
		var isr = parseInt(_obj.dataArr[0][_obj.index[0]])%4 ? 0 : 1;
		var dayarr = [31,28+isr,31,30,31,30,31,30,31,30,31,30];
		var arr = [];
		
		for(var i=1;i <= dayarr[parseInt(_obj.dataArr[1][_obj.index[1]])-1] ; i++){
			arr.push(i+'日');
		}
		return arr;
	},
	
	//重置数据
	resetData : function(num){
		if(_obj.type == 'address'){
			num ++;
			//循环改变联动的数据
			for(var i = num; i < _obj.level; i++){
				_obj.index[i] = _obj.realIdx[i] = _obj.tempIdx[i] = 0;
				_obj.top[i] = (2-_obj.index[i])*_obj.height;
				_obj.setData(i);
				_obj.setLilist(i);
				_obj.changeCls(i);
			}
		}else if(_obj.type == 'calendar' && _obj.level == 3){
			//检查日期是否合法[重新获取的日期与当前日期长度是否一致]
			_obj.setData(2);
			if(_obj.dataArr[2].length !== _obj.liList[2].length){
				if(_obj.index[2] > _obj.dataArr[2].length-1){
					_obj.index[2] = _obj.realIdx[2] = _obj.tempIdx[2] = _obj.dataArr[2].length-1;
				}
				_obj.top[2] = (2-_obj.index[2])*_obj.height;
				_obj.setLilist(2);
				_obj.changeCls(2);
			}
		}
		_obj.setVal();
	},
	setVal:function(){
		//循环将最新的数据值填到value中
		for(var j =0; j< _obj.level; j++){
			if(_obj.liList[j][_obj.index[j]] === undefined){
				_obj.value[j] = '无'
			}else{
				_obj.value[j] = $(_obj.liList[j][_obj.index[j]]).html()
			}
		}
	},

	//设置索引（省市区联动数据用）
	setAddressIndex : function(i,arr){
		//防止传进来的区没有字符，或者字符为空时，索引默认设为0
		var thisVal = (_obj.value[i] === '' || _obj.value[i] === undefined) ? 0 : _obj.getAddressIndex(_obj.value[i],arr);
		_obj.realIdx[i] = _obj.index[i] = _obj.tempIdx[i] = thisVal;
		_obj.value[i] = _obj.dataArr[i][_obj.index[i]].address;
	},
	//获取索引（省市区联动数据用）
	getAddressIndex : function(str,arr){
		var num;
		for(var i = 0; i < arr.length; i++){
			if(arr[i].address === str){
				num = i;
			}
		}
		//如果传递的字符在数组中找不到，则返回0
		num = num===undefined?0:num;
		return num;
	},
	
	//设置日历索引
	setDateIndex : function(i,arr){
		//防止传进来的区没有字符，或者字符为空时，索引默认设为0
		if((_obj.value[i] === '' || _obj.value[i] === undefined)){
			switch(i){
				case 0:
					_obj.value[i] = new Date().getFullYear();
					break;
				case 1:
					_obj.value[i] = new Date().getMonth()+1;
					break;
				case 2:
					_obj.value[i] = new Date().getDate();
					break;
			}
		}
		var thisVal = _obj.getDateIndex(i,_obj.value[i],arr);
		_obj.realIdx[i] = _obj.index[i] = _obj.tempIdx[i] = thisVal;
		_obj.value[i] = _obj.dataArr[i][_obj.index[i]];
	},
	//获取日历索引
	getDateIndex:function(i,str,arr){
		var num;
		for(var i = 0; i < arr.length; i++){
			if( parseInt(arr[i]) == str){
				num = i;
			}
		}
		//如果传递的字符在数组中找不到，则返回0 [日历数组不包含数据的情况应该较少或不存在]
		num = num===undefined?0:num;
		return num;
	},
	//修改样式（针对active,wait两个）
	changeCls : function(i){
		//更新Y轴值
		_obj.yAxis[i] = _obj.siteArr( _obj.dataArr[i].length , _obj.height );
		//ul的样式
		_obj.ulList[i].css('top',_obj.top[i]);
		//删除旧的样式
		$(_obj.ulList[i]).find('.active , .wait').removeAttr('class');
		//添加新的样式[如果索引存在]
		if(_obj.liList[i][_obj.index[i]] !== undefined){
			_obj.liList[i][_obj.index[i]].addClass('active');
		}
		//如果索引+1存在
		if(_obj.liList[i][_obj.index[i]+1] !== undefined){
			_obj.liList[i][_obj.index[i]+1].addClass('wait');
		}
		//如果索引-1存在
		if(_obj.liList[i][_obj.index[i]-1] !== undefined){
			_obj.liList[i][_obj.index[i]-1].addClass('wait');
		}
	}
}