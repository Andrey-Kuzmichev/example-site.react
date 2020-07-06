-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июл 06 2020 г., 19:22
-- Версия сервера: 10.4.11-MariaDB
-- Версия PHP: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `site`
--
CREATE DATABASE IF NOT EXISTS `site` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `site`;

-- --------------------------------------------------------

--
-- Структура таблицы `goods`
--

CREATE TABLE `goods` (
  `id` int(55) UNSIGNED NOT NULL,
  `title` varchar(150) NOT NULL,
  `price` float(15,2) NOT NULL,
  `subtitle` varchar(150) NOT NULL,
  `time` int(45) NOT NULL,
  `now` int(1) NOT NULL DEFAULT 0,
  `block` int(2) NOT NULL DEFAULT 0,
  `description` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `goods`
--

INSERT INTO `goods` (`id`, `title`, `price`, `subtitle`, `time`, `now`, `block`, `description`) VALUES
(0, 'Заголовок 1', 100.00, 'Подзаголовок', 0, 1, 0, 'текст 1'),
(1, 'Заголовок 2', 0.00, 'Подзаголовок', 0, 1, 0, 'текст 2'),
(2, 'Заголовок 3', 0.00, 'Подзаголовок', 0, 0, 0, 'текст 3'),
(3, 'Заголовок 4', 0.00, 'Подзаголовок', 0, 0, 0, 'текст 4'),
(4, 'Заголовок 5', 0.00, 'Подзаголовок', 0, 0, 0, 'текст 5'),
(5, 'Заголовок 6', 0.00, 'Подзаголовок', 0, 0, 0, 'текст 6'),
(6, 'Заголовок 7', 0.00, 'Подзаголовок', 0, 0, 0, 'текст 7'),
(7, 'Заголовок 8', 0.00, 'Подзаголовок', 0, 0, 0, 'текст 8'),
(8, 'Заголовок 9', 0.00, 'Подзаголовок', 0, 0, 0, 'текст 9');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(55) UNSIGNED NOT NULL,
  `login` varchar(90) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(150) NOT NULL,
  `name` varchar(90) NOT NULL DEFAULT 'user',
  `time` int(45) NOT NULL,
  `access` varchar(55) NOT NULL DEFAULT 'user',
  `blocking` int(1) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `token`, `name`, `time`, `access`, `blocking`) VALUES
(1, 'root', 'eb3cvdfg58ca444338e12324eb3c8df65e0c28a62ebbc8dfr', 'qsi1Mi5Z66zMpatFc2oz1tDYN', 'user', 1593965997, 'admin', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `usersorders`
--

CREATE TABLE `usersorders` (
  `id` int(55) UNSIGNED NOT NULL,
  `idUser` varchar(55) NOT NULL,
  `idGoods` int(55) NOT NULL,
  `nameGoods` varchar(150) NOT NULL,
  `price` float(15,2) NOT NULL,
  `name` varchar(90) NOT NULL,
  `email` varchar(90) NOT NULL,
  `telephone` varchar(90) NOT NULL,
  `status` varchar(55) NOT NULL DEFAULT 'Ожидайте'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `goods`
--
ALTER TABLE `goods`
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `id` (`id`);

--
-- Индексы таблицы `usersorders`
--
ALTER TABLE `usersorders`
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `goods`
--
ALTER TABLE `goods`
  MODIFY `id` int(55) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(55) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `usersorders`
--
ALTER TABLE `usersorders`
  MODIFY `id` int(55) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
