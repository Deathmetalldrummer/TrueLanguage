<?php
 require_once ('vendor/autoload.php');
 use Dejurin\GoogleTranslateForFree;

 $source = 'en';
 $target = 'ru';
 $attempts = 5;
 $arr = ['hello','world'];

 $tr = new GoogleTranslateForFree();
 $result = $tr->translate($source, $target, $arr, $attempts);

 var_dump($result);

 print($result);
 print(PHP_EOL);


// $eng = fopen("20k_en.txt", "w");
// print($eng)

$file = file_get_contents("20k_en.txt");
$_file = explode("\n", $file);
// print(count($_file));
$arr = [];
// for ($i = 1; $i <= count($_file); $i++) {
// for ($i = 1; $i <= 10; $i++) {
//     print($i);
//     print(PHP_EOL);
//     $word = $tr->translate($source, $target, $text, $attempts);
//     $obj = array(
//            'key' => $i,
//            'value' => array(
//                'en' => $_file[$i],
//                'ru' => $word
//            )
//    );
//     array_push($arr, $obj);
// }

//     print($arr[1]);
//     print(PHP_EOL);
// $array = [];
$myfile = fopen("en_php.json", "w");
fwrite($myfile, json_encode($arr));

 ?>
