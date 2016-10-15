-- phpMyAdmin SQL Dump
-- version phpStudy 2014
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2016 年 09 月 26 日 19:16
-- 服务器版本: 5.5.40
-- PHP 版本: 5.3.29

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `tour`
--

-- --------------------------------------------------------

--
-- 表的结构 `complain`
--

CREATE TABLE IF NOT EXISTS `complain` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `customId` int(100) NOT NULL,
  `complaint` int(100) NOT NULL,
  `reason` varchar(50) NOT NULL,
  `detail` varchar(200) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=gbk AUTO_INCREMENT=7 ;

--
-- 转存表中的数据 `complain`
--

INSERT INTO `complain` (`id`, `customId`, `complaint`, `reason`, `detail`, `time`) VALUES
(2, 28, 7, 'ddd', 'ddddd', '2016-09-23 18:44:36'),
(4, 32, 8, 'rrrrrrrr', 'rrrrrrrrrrrrr', '2016-09-23 18:46:02'),
(6, 27, 7, '6666', '66666666', '2016-09-23 19:24:06');

-- --------------------------------------------------------

--
-- 表的结构 `country`
--

CREATE TABLE IF NOT EXISTS `country` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `country` char(20) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=gbk AUTO_INCREMENT=9 ;

--
-- 转存表中的数据 `country`
--

INSERT INTO `country` (`id`, `country`, `time`) VALUES
(1, '美国', '0000-00-00 00:00:00'),
(2, '韩国', '0000-00-00 00:00:00'),
(5, '日本', '0000-00-00 00:00:00'),
(8, '荷兰', '2016-09-23 23:02:56');

-- --------------------------------------------------------

--
-- 表的结构 `custom`
--

CREATE TABLE IF NOT EXISTS `custom` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `account` char(20) DEFAULT NULL,
  `password` char(50) DEFAULT NULL,
  `name` char(20) DEFAULT NULL,
  `sex` char(2) DEFAULT NULL,
  `id_number` char(20) DEFAULT NULL,
  `tel` char(11) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=40 ;

--
-- 转存表中的数据 `custom`
--

INSERT INTO `custom` (`id`, `account`, `password`, `name`, `sex`, `id_number`, `tel`, `time`) VALUES
(27, 'wyr', 'fb60d30292512e065f6bbf10f797efec', '王雅茹', '女', '111111111111111113', '11111111111', '2016-09-19 15:35:17'),
(28, 'xwx', '2fbdb7e3ea40303eb1b6da0335af3706', '夏文轩', '男', '222222222222222222', '22222222222', '2016-09-19 17:13:58'),
(30, 'cxy', '6abebdfdca07899fbd010cbdcbeb363f', '陈晓宇', '女', '111111111111111111', '11111111111', '2016-09-22 10:52:32'),
(32, 'sk', '41d6ad0761a5d27a9e1bd567041ce9e9', '孙阔', '男', '333333333333333333', '33333333333', '2016-09-23 13:07:54'),
(39, 'ljq', 'dc2870b1dfdf0fd2c6fecf13d3de0a68', NULL, NULL, NULL, NULL, '2016-09-24 16:52:52');

-- --------------------------------------------------------

--
-- 表的结构 `event`
--

CREATE TABLE IF NOT EXISTS `event` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `customId` int(100) NOT NULL,
  `country` char(20) NOT NULL,
  `date` char(30) NOT NULL,
  `ord` int(10) NOT NULL,
  `update_time` char(30) NOT NULL,
  `admin_name` char(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=32 ;

--
-- 转存表中的数据 `event`
--

INSERT INTO `event` (`id`, `customId`, `country`, `date`, `ord`, `update_time`, `admin_name`) VALUES
(4, 28, '韩国', '2007-09-01 13:12:10', 2, '2016-09-23 14:08:47', 'yy'),
(29, 27, '美国', '2016-09-22 16:35:25', 3, '2016-09-23 13:41:54', 'admin'),
(31, 38, '日本', '2016-09-23 19:56:03', 0, '2016-09-23 19:56:03', 'admin');

-- --------------------------------------------------------

--
-- 表的结构 `message`
--

CREATE TABLE IF NOT EXISTS `message` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `customId` int(100) NOT NULL,
  `content` varchar(200) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=gbk AUTO_INCREMENT=9 ;

--
-- 转存表中的数据 `message`
--

INSERT INTO `message` (`id`, `customId`, `content`, `time`) VALUES
(3, 30, 'wwwwwwwwwwwwww', '2016-09-23 18:45:05'),
(4, 32, 'rrrrrrr', '2016-09-23 18:45:52'),
(8, 27, 'eeeeeeee', '2016-09-23 19:09:59');

-- --------------------------------------------------------

--
-- 表的结构 `process`
--

CREATE TABLE IF NOT EXISTS `process` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `country` char(20) NOT NULL,
  `process` char(20) DEFAULT NULL,
  `descript` char(100) DEFAULT NULL,
  `order` int(10) DEFAULT NULL,
  `add_time` char(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=26 ;

--
-- 转存表中的数据 `process`
--

INSERT INTO `process` (`id`, `country`, `process`, `descript`, `order`, `add_time`) VALUES
(1, '美国', '开始', '开始办理', 0, '2005-05-30 10:30:20'),
(2, '美国', '流程1', '流程1', 1, '2005-05-30 10:30:20'),
(3, '美国', '流程2', '流程2', 2, '2005-05-30 10:30:20'),
(4, '美国', '流程3', '流程3', 3, '2005-05-30 10:30:20'),
(5, '美国', '结束', '签证办理完成', 5, '2005-05-30 10:30:20'),
(6, '韩国', '开始', '开始办理', 0, '2005-06-26 09:10:10'),
(7, '韩国', '流程1', '流程1', 1, '2005-06-26 09:10:10'),
(8, '韩国', '流程2', '流程2', 3, '2005-06-26 09:10:10'),
(9, '韩国', '结束', '签证办理完成', 4, '2005-06-26 09:10:10'),
(10, '日本', '开始', '开始办理', 0, '2006-10-01 07:10:20'),
(11, '日本', '流程1', '流程1', 1, '2006-10-01 07:10:20'),
(12, '日本', '流程2', '流程2', 2, '2006-10-01 07:10:20'),
(13, '日本', '流程3', '流程3', 3, '2006-10-01 07:10:20'),
(14, '日本', '结束', '签证办理结束', 4, '2006-10-01 07:10:20'),
(16, '荷兰', '开始', '开始办理', 1, '2016-09-24 13:07:30'),
(17, '荷兰', '流程1', '流程1', 2, '2016-09-24 13:07:44'),
(18, '荷兰', '流程2', '流程2', 3, '2016-09-24 13:07:52'),
(24, '荷兰', '流程3', '流程3', 4, '2016-09-24 13:16:37'),
(25, '荷兰', '结束', '签证办理完成', 5, '2016-09-24 13:17:09');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `account` char(20) NOT NULL,
  `password` char(50) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=9 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `account`, `password`, `time`) VALUES
(7, 'admin', '21232f297a57a5a743894a0e4a801fc3', '2016-09-19 15:26:53'),
(8, 'yy', '2fb1c5cf58867b5bbc9a1b145a86f3a0', '2016-09-22 14:15:12');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
