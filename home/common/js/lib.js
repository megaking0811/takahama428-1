/**
 * Common javascript
 *
 * depends	jquery-3.2.1
 *			Bootstrap 4.0.0
 */
$(function(){
	/**
	 * extended the jQuery object 
	 */
	jQuery.extend({
		msgbox: function(msg){
		/**
		 * メッセージボックス
		 * @msg		表示するメッセージ文
		 * @arguments	タイトルを指定、指定なしの場合は「メッセージ」
		 */
			var title = arguments.length==2? arguments[1]: 'メッセージ';
			$('#msgbox').off('show.bs.modal').on('show.bs.modal', {'message': msg, 'title':title}, function (e) {
				$('.modal-footer').hide();
				$('#msgbox .modal-title').html(e.data.title);
				$('#msgbox .modal-body p').html(e.data.message);
			});
			if ($('#msgbox').isVisible()) {
				$('#msgbox').on('hidden.bs.modal', function(){
					$('#msgbox').off('hidden.bs.modal');
					$('#msgbox').modal('show');
				});
				$('#msgbox').modal('hide');
			} else {
				$('#msgbox').modal('show');
			}
		},
		confbox: {
		/**
		 * 確認ボックス
		 * @msg		表示するメッセージ文
		 * @fn			callback ボタンが押された後の処理　OK:true, Cancel:false
		 */
			show: function(msg, fn){
				$.confbox.result.data = false;
				$('#msgbox').off('show.bs.modal').on('show.bs.modal', {'message': msg}, function (e) {
					$('.modal-footer').show();
					$('#msgbox .modal-body p').html(e.data.message);
					$(this).one('click', '.is-ok', function(){
						$.confbox.result.data = true;
					});
					$(this).one('click', '.is-cancel', function(){
						$.confbox.result.data = false;
					});
				});
				$('#msgbox').off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					fn();
				});
				$('#msgbox').modal('show');
			},
			result: {
				'data':false
			}
		},
		check_phone: function(my){
			var str = my.value.trim().replace(/[０-９]/g, function(m){
				var a = "０１２３４５６７８９";
				var r = a.indexOf(m);
				return r==-1? m: r;
			});
			my.value = str.replace(/[−.*━.*‐.*―.*－.*\-.*ー.*\-]/gi,'-');
			var tel = my.value.replace(/[-]/gi,'');
			if (!tel.match(/^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/)) {
				return false;
			} else {
				return true;
			}
		},
		check_email: function(email){
		/**
		 * メールアドレスの妥当性チェック
		 * @email		メールアドレス
		 * @return		OK: true	NG: false
		 */

			if(email.trim()=="" || !email.match(/@/)){
				$.msgbox('メールアドレスではありません。');
				return false;
			}

			var res = false;

			/*	RFC2822 addr_spec 準拠パターン							*/
			/*	atom       = {[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+};		*/
			/*  dot_atom   = {$atom(?:\.$atom)*};						*/
			/*  quoted     = {"(?:\\[^\r\n]|[^\\"])*"};					*/
			/*  local      = {(?:$dot_atom|$quoted)};					*/
			/*  domain_lit = {\[(?:\\\S|[\x21-\x5a\x5e-\x7e])*\]};		*/
			/*  domain     = {(?:$dot_atom|$domain_lit)};				*/
			/*  addr_spec  = {$local\@$domain};							*/
			$.ajax({
				url:'/php_libs/checkDNS.php', async:false, type:'POST', dataType:'text', timeout:5000, data:{'email': email}
			}).done(function(r){
				if(r){
					if( email.match(/^(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:"(?:\\[^\r\n]|[^\\"])*")))\@(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:\[(?:\\\S|[\x21-\x5a\x5e-\x7e])*\])))$/)){
						//$.msgbox('OK!\n確認メールを送信してください。');
						res = true;
					}else{
						$.msgbox('メールアドレスを確認してください。');
					}
				}else{
					$.msgbox('@マークより後を確認してください。');
				}
			}).fail(function(xhr, status, error){
				alert("Error: "+error+"<br>通信エラーです。");
			});

			return res;

		},
		check_NaN:function(my){
		/**
		 * 自然数かどうか
		 * @my			Object
		 * @return		自然数でない場合に0を返す、第二引数があれば、自然数以外のときの返り値として使用
		 */
			var err = arguments.length>1? arguments[1]: 0;
			var str = my.value.trim().replace(/[０-９]/g, function(m){
				var a = "０１２３４５６７８９";
				var r = a.indexOf(m);
				return r==-1? m: r;
			});
			my.value = (str.match(/^\d+$/))? str-0: err;
			return my.value;
		},
		TLA: {
			'api':'https://takahamalifeart.com/v1/api',
			'show_site':'1',
			'holidayInfo':{},	// カレンダーの休日情報
			'tapEvent':'click'
		},
		isTouchAvailable: 'ontouchstart' in window,
		tapEvent: function() {
			if ('ontouchstart' in window) {
				$.TLA.tapEvent = 'ontouchstart'
			} else {
				$.TLA.tapEvent = 'click';
			}
		}
	});
	
	
	/**
	 * 要素の表示・非表示を判定
	 * @return {boolean} true:表示  false:非表示
	 */
	$.fn.isVisible = function() {
		return $.expr.filters.visible(this[0]);
	};
	
	
	/**
	 * スムーススクロール
	 * jQuery UI tabs を除く
	 */
	$('body').on($.TLA.tapEvent, 'a[href^="#"]:not(".ui-tabs-anchor")', function(e) {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			// headerの高さ
			$adjust = 10;
			$('header').children().each(function(){
				$adjust += $(this).outerHeight(true);
			});
			// scroll
			var $target = $(this.hash);
			$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
			if ($target.length) {
				var targetOffset = $target.offset().top - $adjust;
				$('html,body').animate({scrollTop: targetOffset}, 1000, 'swing');
//				return false;
				e.preventDefault();
			} else if (this.hash=='#top') {
				$('html,body').animate({scrollTop: 0}, 1000, 'swing');
//				return false;
				e.preventDefault();
			}
		}
	});
	
	
	/** dropdown event */
	$('.dropdown').on('show.bs.dropdown', function(e){
		$('#overlay-mask').addClass('modal-backdrop show');
	});
	$('.dropdown').on('hidden.bs.dropdown', function(e){
		$('#overlay-mask').removeClass('modal-backdrop show');
		
	});
	
	/** for PC */
	if (!$.isTouchAvailable) {
		$('header .navi_back .dropdown button').on('mouseover', function(){
			if ($('#overlay-mask').hasClass('modal-backdrop show')) {
				if ($(this).next('.dropdown-menu').isVisible()) return;
				$(this).click();
			}
		});
	}
	
	/** language */
	$('.dropdown').on($.TLA.tapEvent, '.header_language', function(ev){
		return false;
	});
	
	
	/** goto cart page */
	$('#show_cart').on('click', function(){
		if (location.pathname!='/order/') {
			location.href = '/order/?update=2';
		} else {
			$.ajax({
				url:'/php_libs/orders.php', type:'get', dataType:'json', async:true, timeout:5000, data:{'act':'details'}
			}).done(function(r){
				if(r.design.length==0 && r.options.noprint==0){
					$.msgbox('プリントするデザインの色数を指定してください。');
				}else{
					$.setCart(r);
				}
			}).fail(function(xhr, status, error){
				$.msgbox("Error: "+error+"<br>カート情報が取得できませんでした。");
			});
		}
	});
	
	
	/** tooltip */
	$('[data-toggle="tooltip"]').tooltip();
});
