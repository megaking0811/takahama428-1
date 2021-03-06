<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/php_libs/conndb_holiday.php';

$https = !empty($_SERVER['HTTPS']) && strcasecmp($_SERVER['HTTPS'], 'on') === 0 ||
	!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && strcasecmp($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') === 0;
$protocol = ($https ? 'https://' : 'http://');
$full_url = $protocol.(!empty($_SERVER['REMOTE_USER']) ? $_SERVER['REMOTE_USER'].'@' : '').
	(isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : ($_SERVER['SERVER_NAME'].
														 ($https && $_SERVER['SERVER_PORT'] === 443 ||
														 $_SERVER['SERVER_PORT'] === 80 ? '' : ':'.$_SERVER['SERVER_PORT'])));
define('_DOMAIN', $full_url);

define('_DOC_ROOT', $_SERVER['DOCUMENT_ROOT'].'/');
define('_SESS_SAVE_PATH', $_SERVER['DOCUMENT_ROOT'].'/../cgi-bin/sesstmp/');

define('_GUEST_IMAGE_PATH', 'user/guest/data/');
define('_MEMBER_IMAGE_PATH', 'user/member/data/');

define('_MAXIMUM_SIZE', 104857600);		// max upload file size is 100MB(1024*1024*100).

define('_ALL_EMAIL', 'all@takahama428.com');
define('_INFO_EMAIL', 'info@takahama428.com');
define('_ORDER_EMAIL', 'order@takahama428.com');
define('_REQUEST_EMAIL', 'request@takahama428.com');
define('_ESTIMATE_EMAIL', 'estimate@takahama428.com');

define('_TEST_EMAIL', 'test@takahama428.com');

define('_OFFICE_TEL', '03-5670-0787');
define('_OFFICE_FAX', '03-5670-0730');
define('_TOLL_FREE', '0120-130-428');

define('_PACK_FEE', 50);
define('_NO_PACK_FEE', 10);
define('_CREDIT_RATE', 0.05);	// カード手数料率

if (strpos($_SERVER['HTTP_HOST'], 'test.')===false && strpos($_SERVER['HTTP_HOST'], 'sub.')===false) {
	$_ORDER_DOMAIN = 'http://original-sweat.com';
	$_API_DOMAIN = 'https://takahamalifeart.com/v1';
	define('_VHOST_PATH', 'dev_takahama428.com');
} else {
	$_ORDER_DOMAIN = 'http://test.original-sweat.com';
	$_API_DOMAIN = 'http://test.takahamalifeart.com/v1';
	if (strpos($_SERVER['HTTP_HOST'], 'test.')===0) {
		define('_VHOST_PATH', 'dev_test.takahama428.com');
	} else {
		define('_VHOST_PATH', 'dev_sub.takahama428.com');
	}
}
define('_API', $_API_DOMAIN.'/api');
define('_API_U', $_API_DOMAIN.'/apiu');
define('_API_PSS', 'http://takahama428.co-site.jp/v1/api');		// Photo Sharing Service Member
define('_IMG_PSS', 'https://takahamalifeart.com/weblib/img/');

// 注文情報の登録
define('_ORDER_INFO', $_ORDER_DOMAIN.'/system/php_libs/ordersinfo.php');

// マイページのイメージ画像で使用
define('_ORDER_DOMAIN', $_ORDER_DOMAIN);

// PASSWORD KEY
define('_PASSWORD_KEY', 'Rxjo:akLK(SEs!8E');

// Facebook App
define('_FB_APP_ID', '333981563415198');
define('_FB_APP_SECRET', 'd9d6f330b795e81af0d875c0e5b0d9a3');

// Instagram
define('_INSTA_CLIENT_ID', '19a9042d525e46a79bb82c2d845b8f96');
define('_INSTA_ACCESS_TOKEN', '5720606509.19a9042.fffaedf009704c1eb42a63bf0399ef17');

// アイテム一覧ページで当日特急用サムネイルを使用する場合は 1、使用しない場合は 0 を設定
define('_IS_THUMB_FOR_EXPRESS', '1');

//本サイトの識別子
define('_SITE', '1');

//休業日付、お知らせの取得
$hol = new Conndb_holiday();
$holiday_data = $hol->getHolidayinfo();
if($holiday_data['notice']=="" && $holiday_data['notice-ext']==""){
	$notice = "";
	$extra_noitce = "";
}else{
	$notice = $holiday_data['notice'];
	$extra_noitce = $holiday_data['notice-ext'];
}
$time_start = str_replace("-","/",$holiday_data['start']);
$time_end = str_replace("-","/",$holiday_data['end']);

//休業期間、お知らせ
define('_FROM_HOLIDAY', $time_start);
define('_TO_HOLIDAY', $time_end);
define('_NOTICE_HOLIDAY', $notice);
define('_EXTRA_NOTICE', $extra_noitce);
?>
