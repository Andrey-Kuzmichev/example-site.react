<?php

class database
{
    private PDO $pdo;

    public function __construct()
    {
        $dsn = 'mysql:host='.config['db']['host'].';dbname='.config['db']['database'].';charset=utf8mb4';
        $opt = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_PERSISTENT => true,
        ];
        $this->pdo = new PDO($dsn, config['db']['user'], config['db']['pass'], $opt);
    }

    public function get($argument)
    {
        return $this->pdo->query('SELECT '.$argument['field'].' FROM '.$argument['table'].' WHERE '.$argument['where'].'='.$argument[$argument['where']])->fetch();
    }

    public function gets($argument): array
    {
        if (isset($argument['where'])) {
            return $this->pdo->query('SELECT '.$argument['field'].' FROM '.$argument['table'].' WHERE '.$argument['where'].'='.$argument[$argument['where']])->fetchAll();
        }

        return $this->pdo->query('SELECT '.$argument['field'].' FROM '.$argument['table'])->fetchAll();
    }

    public function add($argument): void
    {
        $this->pdo->exec('INSERT INTO '.$argument['table'].' ('.$argument['list'].') VALUES ('.$argument['data'].')');
    }

    public function edit($argument): void
    {
        $this->pdo->exec('UPDATE '.$argument['table'].' SET '.$argument['data'].' WHERE '.$argument['table'].'.'.$argument['where']);
    }

    public function remove($argument): void
    {
        $this->pdo->exec('DELETE FROM '.$argument['table'].' WHERE '.$argument['table'].'.'.$argument['where']);
    }
}

/*
* get(['field' => '*', 'table' => 'users', 'where' => 'user', 'user' => 'test']); Пример получение данных с таблицы
* add(['table' => 'users', 'list' => 'login, password', 'data' => "'user','pass'"]); Пример добавления данных в таблицу
* edit(['table' => 'users', 'data' => "password = 'pass'", 'where' => "login = 'user'"]); Пример редактирование таблицы
* remove(['table' => 'users', 'where' => "login = 'das'"]) Удаление данных из таблицы
*/