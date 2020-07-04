<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://192.168.1.40:3000');

require('config.php');
require('database.php');
$data = new database();

if (file_get_contents('php://input')) {
    $body = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);

    if (isset($body['action'], $body['login'], $body['password']) && $body['action'] === 'reg') {
        $searchReg = $data->get(['field' => 'id', 'table' => 'users', 'where' => 'login', 'login' => "'".$body['login']."'"]);
        if (!isset($searchReg['id'])) {
            date_default_timezone_set('Europe/Moscow');
            $pass = 'eb3cvdfg5'.md5($body['password']).'ebbc8dfr';
            $data->add([
                'table' => 'users',
                'list' => 'login, password, token, time',
                'data' => "'".$body['login']."','".$pass."','".generateToken()."','".time()."'",
            ]);
            $reg = $data->get(['field' => 'id, token', 'table' => 'users', 'where' => 'login', 'login' => "'".$body['login']."'"]);
            echo json_encode(['status' => 'successfully', 'list' => ['id' => $reg['id'], 'token' => $reg['token']]], JSON_THROW_ON_ERROR);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Имя пользователя занято!'], JSON_THROW_ON_ERROR);
        }
        die;
    }

    if (isset($body['action'], $body['login'], $body['password']) && $body['action'] === 'auth') {
        $auth = $data->get(['field' => 'id, password, token, blocking', 'table' => 'users', 'where' => 'login', 'login' => "'".$body['login']."'"]);
        if (isset($auth['id'])) {
            $pass = 'eb3cvdfg5'.md5($body['password']).'ebbc8dfr';
            if ($auth['password'] === $pass) {
                if (!$auth['blocking']) {
                    echo json_encode(['status' => 'successfully', 'list' => ['id' => $auth['id'], 'token' => $auth['token']]], JSON_THROW_ON_ERROR);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Вы были заблокированы!'], JSON_THROW_ON_ERROR);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Проверьте правильность вводимых данных!'], JSON_THROW_ON_ERROR);
            }
        }
        die;
    }

    if (isset($body['action'], $body['order']['name'], $body['order']['idGoods'], $body['order']['email'], $body['order']['telephone'], $body['order']['user']) &&
        $body['action'] === 'order') {
        if (!$body['order']['user']) {
            $product = $data->get(['field' => 'id, title, price', 'table' => 'goods', 'where' => 'id', 'id' => "'".$body['order']['idGoods']."'"]);
            if (isset($product['id'])) {
                $data->add([
                    'table' => 'usersorders',
                    'list' => 'idUser, idGoods, nameGoods, price, name, email, telephone',
                    'data' => "'-1','".$body['order']['idGoods']."','".$product['title']."','".$product['price']."','".
                        $body['order']['name']."','".$body['order']['email']."','".$body['order']['telephone']."'",
                ]);
                echo json_encode(['status' => 'successfully', 'message' => 'Успешный заказ'], JSON_THROW_ON_ERROR);
            } else {
                echo json_encode(['status' => 'error'], JSON_THROW_ON_ERROR);
            }
        } else {
            $product = $data->get(['field' => 'id, title, price', 'table' => 'goods', 'where' => 'id', 'id' => "'".$body['order']['idGoods']."'"]);
            if (isset($product['id'])) {
                $profile = $data->get(['field' => 'id, blocking', 'table' => 'users', 'where' => 'token', 'token' => "'".$body['order']['user']."'"]);

                if (isset($profile['id'])) {
                    if (!$profile['blocking']) {
                        $data->add([
                            'table' => 'usersorders',
                            'list' => 'idUser, idGoods, nameGoods, price, name, email, telephone',
                            'data' => "'".$body['order']['user']."','".$body['order']['idGoods']."','".$product['title']."','".$product['price']."','".
                                $body['order']['name']."','".$body['order']['email']."','".$body['order']['telephone']."'",
                        ]);
                        echo json_encode(['status' => 'successfully'], JSON_THROW_ON_ERROR);
                    }
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Ошибка при оформлении заказа!'], JSON_THROW_ON_ERROR);
                }
            } else {
                echo json_encode(['status' => 'error'], JSON_THROW_ON_ERROR);
            }
        }
        die;
    }

    if (isset($body['action'], $body['token']) && $body['action'] === 'profile') {
        $profile = $data->get(['field' => 'name, time, access, blocking', 'table' => 'users', 'where' => 'token', 'token' => "'".$body['token']."'"]);

        if (isset($profile['name'])) {
            if (!$profile['blocking']) {
                echo json_encode($profile, JSON_THROW_ON_ERROR);
            }
        } else {
            echo json_encode(['status' => 'error'], JSON_THROW_ON_ERROR);
        }
        die;
    }

    if (isset($body['action'], $body['token']) && $body['action'] === 'ordersProfile') {
        $profile = $data->get(['field' => 'access, blocking', 'table' => 'users', 'where' => 'token', 'token' => "'".$body['token']."'"]);

        if (isset($profile['blocking']) && !$profile['blocking']) {
            if ($profile['access'] === 'user') {
                $ordersProfile = $data->gets([
                    'field' => 'id, nameGoods, price, name, email, telephone, status',
                    'table' => 'usersorders',
                    'where' => 'idUser',
                    'idUser' => "'".$body['token']."'",
                ]);
            } else {
                $ordersProfile = $data->gets([
                    'field' => 'id, nameGoods, price, name, email, telephone, status',
                    'table' => 'usersorders',
                ]);
            }

            echo json_encode($ordersProfile, JSON_THROW_ON_ERROR);
        } else {
            echo json_encode(['status' => 'error'], JSON_THROW_ON_ERROR);
        }
        die;
    }

    if (isset($body['action'], $body['token'], $body['product']) && $body['action'] === 'orderCancel') {
        $profile = $data->get(['field' => 'access, blocking', 'table' => 'users', 'where' => 'token', 'token' => "'".$body['token']."'"]);

        if (isset($profile['blocking']) && !$profile['blocking']) {
            if ($profile['access'] === 'user') {
                $orderCancel = $data->get([
                    'field' => 'id, status',
                    'table' => 'usersorders',
                    'where' => 'idUser',
                    'idUser' => "'".$body['token']."'",
                ]);

                if (isset($orderCancel['id']) && $orderCancel['status'] === 'Ожидайте') {
                    $data->remove(['table' => 'usersorders', 'where' => "id = '".$body['product']."'"]);
                    echo json_encode(['status' => 'successfully'], JSON_THROW_ON_ERROR);
                } else {
                    echo json_encode([], JSON_THROW_ON_ERROR);
                }
            } else {
                $data->remove(['table' => 'usersorders', 'where' => "id = '".$body['product']."'"]);
                echo json_encode(['status' => 'successfully'], JSON_THROW_ON_ERROR);
            }
        } else {
            echo json_encode(['status' => 'error'], JSON_THROW_ON_ERROR);
        }
        die;
    }

    if (isset($body['action'], $body['token'], $body['product'], $body['orderChanges']) && $body['action'] === 'orderChanges') {
        $profile = $data->get(['field' => 'access, blocking', 'table' => 'users', 'where' => 'token', 'token' => "'".$body['token']."'"]);

        if (isset($profile['blocking']) && !$profile['blocking'] && $profile['access'] !== 'user' && isset($body['orderChanges']['status'])) {
            $statusList = ['Ожидайте' => 'Ожидайте', 'Выполняется' => 'Выполняется', 'Готов' => 'Готов'];
            if (isset($statusList[$body['orderChanges']['status']])) {
                $data->edit(['table' => 'usersorders', 'data' => "status = '".$body['orderChanges']['status']."'", 'where' => "id = '".$body['product']."'"]);
                echo json_encode(['status' => 'successfully'], JSON_THROW_ON_ERROR);
            }
        } else {
            echo json_encode(['status' => 'error'], JSON_THROW_ON_ERROR);
        }
        die;
    }
    die;
}

if (isset($_GET['action'])) {
    if ($_GET['action'] === 'goods') {
        $goods = $data->gets(['field' => 'id, title, price, subtitle, time, now, description', 'table' => 'goods', 'where' => 'block', 'block' => '0']);
        echo json_encode($goods, JSON_THROW_ON_ERROR);
        die;
    }
    die;
}

die;

function generateToken($length = 25)
{
    $chars = 'QWERTYUIOPASDFGHJKLZXCVBNM0987654321abdefhiknrstyzqwertyuiopasdfghjklzxcvbnmABDEFGHKNQRSTYZ0123456789';
    $numChars = strlen($chars);
    $string = '';
    for ($i = 0; $i < $length; $i++) {
        $string .= $chars[random_int(1, $numChars) - 1];
    }

    return $string;
}