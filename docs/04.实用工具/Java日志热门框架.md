---
title: Java 日志热门框架
date: 2024-05-29 21:56:18
permalink: /tools/java-logs/
categories:
  - 实用工具
tags:
  - 
author: 
  name: bombax
  link: https://github.com/coderofmutou
---
# Java 日志热门框架

## 日志的概念

### 日志文件

- **日志文件是用于记录系统操作事件的文件集合，可分为事件日志和消息日志**。具有处理历史数据、诊断问题的追踪以及理解系统的活动等重要作用。
- 在计算机中，日志文件是记录在操作系统或其他软件运行中发生的事件或在通信软件的不同用户之间的消息的文件。记录是保持日志的行为。在最简单的情况下，消息被写入单个日志文件。
- 许多操作系统，软件框架和程序包括日志系统。广泛使用的日志记录标准是在因特网工程任务组(IETF)RFC5424 中定义的 syslog。 syslog 标准使专用的标准化子系统能够生成，过滤，记录和分析日志消息。

#### 调试日志

软件开发中，我们经常需要去调试程序，做一些信息，状态的输出便于我们查询程序的运行状况。为了让我们能够更加灵活和方便的控制这些调试的信息，所有我们需要专业的日志技术。java 中寻找 bug 会需要重现。调试也就是 debug 可以在程序运行中暂停程序运行，可以查看程序在运行中的情况。日志主要是为了更方便的去重现问题。

#### 系统日志

系统日志是记录系统中硬件、软件和系统问题的信息，同时还可以监视系统中发生的事件。用户可以通过它来检查错误发生的原因，或者寻找受到攻击时攻击者留下的痕迹。系统日志包括系统日志、应用程序日志和安全日志。

**系统日志的价值:**

- 系统日志策略可以在故障刚刚发生时就向你发送警告信息，系统日志帮助你在最短的时间内发现问题。
- 系统日志是一种非常关键的组件，因为系统日志可以让你充分了解自己的环境。这种系统日志信息对于决定故障的根本原因或者缩小系统攻击范围来说是非常关键的，因为系统日志可以让你了解故障或者袭击发生之前的所有事件。
- 为虚拟化环境制定一套良好的系统日志策略也是至关重要的，因为系统日志需要和许多不同的外部组件进行关联。良好的系统日志可以防止你从错误的角度分析问题，避免浪费宝贵的排错时间。
- 另外一种原因是借助于系统日志，管理员很有可能会发现一些之前从未意识到的问题，在几乎所有刚刚部署系统日志的环境当中。

## JAVA 日志框架

问题：

1. 控制日志输出的内容和格式
2. 控制日志输出的位置
3. 日志优化：异步日志，日志文件的归档和压缩
4. 日志系统的维护
5. 面向接口开发 —— 日志的门面

### 为什么要用日志框架

- 因为软件系统发展到今天已经很复杂了，特别是服务器端软件，涉及到的知识，内容，问题太多。在某些方面使用别人成熟的框架，就相当于让别人帮你完成一些基础工作，你只需要集中精力完成系统的业务逻辑设计。
- 而且框架一般是成熟，稳健的，他可以处理系统很多细节问题，比如，事务处理，安全性，数据流控制等问题。
- 还有框架一般都经过很多人使用，所以结构很好，所以扩展性也很好，而且它是不断升级的，你可以直接享受别人升级代码带来的好处。

### 现有的日志框架

JUL(java util logging)、logback、log4j、log4j2

JCL(Jakarta Commons Logging)、slf4j( Simple Logging Facade for Java)

**日志门面**

JCL、slf4j

**日志实现**
JUL、logback、log4j、log4j2

## JUL 学习

JUL 全称 Java util Logging， 是 java 原生的日志框架，使用时不需要另外引用第三方类库，相对其他日志框架使用方便，学习简单，能够在小型应用中灵活使用。

### JUL 入门

#### 架构介绍

![image-20240526203156486](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240526203156486.png)

- Loggers：被称为记录器，应用程序通过获取 Logger 对象，调用其 API 来发布日志信息。Logger 通常是应用程序访问日志系统的入口程序。
- Appenders：也被称为 Handlers，每个 Logger 都会关联一组 Handlers，Logger 会将日志交给关联 Handlers 处理，由 Handlers 负责将日志做记录。Handlers 在此是一个抽象，其具体的实现决定了日志记录的位置可以是控制台、文件、网络上的其他日志服务或操作系统日志等。
- Layouts：也被称为 Formatters，它负责对日志事件中的数据进行转换和格式化。Layouts 决定了数据在一条日志记录中的最终形式。
- Level：每条日志消息都有一个关联的日志级别。该级别粗略指导了日志消息的重要性和紧迫，我们可以将 Level 和 Loggers，Appenders 做关联以便于我们过滤消息。
- Filters：过滤器，根据需要定制哪些信息会被记录，哪些信息会被放过。

**总结一下就是：**

- 用户使用 Logger 来进行日志记录，Logger 持有若干个 Handler，日志的输出操作是由 Handler 完成的。
- 在 Handler 在输出日志前，会经过 Filter 的过滤，判断哪些日志级别过滤放行哪些拦截，Handler 会将日志内容输出到指定位置（日志文件、控制台等）。
- Handler 在输出日志时会使用 Layout，将输出内容进行排版。

#### 入门案例

```xml
<dependencies>
    <dependency>
        <!-- 引入 junit -->
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
</dependencies>
```

```java
package com.itheima;

import org.junit.Test;

import java.util.logging.Level;
import java.util.logging.Logger;

public class JULTest {
    // 快速入门
    @Test
    public void testQuick() throws Exception {
        // 1. 获取日志记录器对象
        Logger logger = Logger.getLogger("JULTest.class");
        // 2. 日志记录输出
        logger.info("hello jul");

        // 通用方法进行记录
        logger.log(Level.INFO, "info msg");

        // 通过占位符 方式输出变量名
        String name = "itcast";
        Integer age = 13;
        logger.log(Level.INFO, "用户信息：{0}，{1}", new Object[]{name, age});
    }
}
```

### 日志的级别

#### jul 中定义的日志级别

* `java.util.logging.Level` 中定义了日志的级别：
  * `SEVERE`（最高值）
  * `WARNING`
  * `INFO`（默认级别）
  * `CONFIG`
  * `FINE`
  * `FINER`
  * `FINEST`（最低值）


* 还有两个特殊的级别：
  * `OFF`，可用来关闭日志记录。
  * `ALL`，启用所有消息的日志记录。


虽然我们测试了 7 个日志级别，但是默认只实现 info 以上的级别

```java
// 日志级别
@Test
public void testLogLevel() throws Exception {
    // 1. 获取日志记录器对象
    Logger logger = Logger.getLogger("JULTest.class");
    // 2. 日志记录输出
    logger.severe("severe");
    logger.warning("warning");
    logger.info("info");    // jul 默认的日志级别
    logger.config("config");
    logger.fine("fine");
    logger.finer("finer");
    logger.finest("finest");
}
```

#### 自定义日志级别配置

```java
// 自定义日志级别
@Test
public void testLogConfig() throws Exception {
    // 1. 获取日志记录器对象
    Logger logger = Logger.getLogger("JULTest.class");
    // 一、自定义日志级别
    // a. 关闭系统默认配置
    logger.setUseParentHandlers(false);
    // b. 创建 ConsoleHandler 控制台输出
    ConsoleHandler consoleHandler = new ConsoleHandler();
    // c. 创建简单格式转换对象
    SimpleFormatter simpleFormatter = new SimpleFormatter();
    // d. 进行关联
    consoleHandler.setFormatter(simpleFormatter);
    logger.addHandler(consoleHandler);
    // e. 配置日志具体级别
    logger.setLevel(Level.ALL);
    consoleHandler.setLevel(Level.ALL);

    // 二、输出到日志文件
    // a. 创建 FileHandler 文件输出
    FileHandler fileHandler = new FileHandler("jul.log");
    // 进行关联
    fileHandler.setFormatter(simpleFormatter);
    logger.addHandler(fileHandler);

    // 2. 日志记录输出
    logger.severe("severe");
    logger.warning("warning");
    logger.info("info");    // jul 默认的日志级别
    logger.config("config");
    logger.fine("fine");
    logger.finer("finer");
    logger.finest("finest");
}
```

### Logger 之间的父子关系

**JUL 中 Logger 之间存在父子关系**，这种父子关系通过树状结构存储，JUL 在初始化时会创建一个顶层 RootLogger 作为所有 Logger 父 Logger，存储上作为树状结构的根节点。父子关系通过路径来关联。

```java
// Logger 对象父子关系
@Test
public void testLogParent() throws Exception {
    // 日志记录器对象父子关系
    Logger logger1 = Logger.getLogger("com.itheima");
    Logger logger2 = Logger.getLogger("com");
    // 测试
    System.out.println(logger1.getParent() == logger2);
    // 所以日志记录器对象的顶级父元素 class为 java.util.logging.LogManager$RootLogger，name ""
    System.out.println("logger2 Parent:" + logger2.getParent() + ",name:" + logger2.getParent().getName());

    // 设置 logger2 的日志级别
    // a. 关闭系统默认配置
    logger2.setUseParentHandlers(false);
    // b. 创建 ConsoleHandler 控制台输出
    ConsoleHandler consoleHandler = new ConsoleHandler();
    // c.创建简单格式转换对象
    SimpleFormatter simpleFormatter = new SimpleFormatter();
    // d.进行关联
    consoleHandler.setFormatter(simpleFormatter);
    logger2.addHandler(consoleHandler);
    // e. 配置日志具体级别
    logger2.setLevel(Level.ALL);
    consoleHandler.setLevel(Level.ALL);

    // 测试日志记录器对象父子关系
    logger1.severe("severe");
    logger1.warning("warning");
    logger1.info("info");
    logger1.config("config");
    logger1.fine("fine");
    logger1.finer("finer");
    logger1.finest("finest");
}
```

### 日志的配置文件

默认配置文件路径 `$JAVAHOME\jre\lib\logging.properties`

```java
// 加载自定义配置文件
@Test
public void testLogProperties() throws Exception {
    // 1. 读取配置文件，通过类加载器完成
    InputStream inputStream = JULTest.class.getClassLoader().getResourceAsStream("logging.properties");
    // 2. 获取日志管理器对象 LogManager
    LogManager logManager = LogManager.getLogManager();
    logManager.readConfiguration(inputStream);
    // 3. 通过日志管理器加载配置文件
    Logger logger = Logger.getLogger("com.itheima");
    logger.severe("severe");
    logger.warning("warning");
    logger.info("info");    // jul 默认的日志级别
    logger.config("config");
    logger.fine("fine");
    logger.finer("finer");
    logger.finest("finest");

    Logger logger2 = Logger.getLogger("com.itheima.log.JULTest");
    logger2.severe("severe test");
    logger2.warning("warning test");
    logger2.info("info test");
    logger2.config("config test");
    logger2.fine("fine test");
    logger2.finer("finer test");
    logger2.finest("finest test");
}
```


配置文件：

```properties
# RootLogger 顶级父元素指定的默认处理器为：ConsoleHandler
handlers= java.util.logging.FileHandler

# RootLogger 顶级父元素默认的日志级别为 INFO
.level= INFO

# 向日志文件输出的 handler 对象
# 指定日志文件路径
java.util.logging.FileHandler.pattern = java%u.log
# 指定日志文件内容大小（50000字节）
java.util.logging.FileHandler.limit = 50000
# 指定日志文件数量
java.util.logging.FileHandler.count = 1
# 指定 handler 对象日志消息格式对象
java.util.logging.FileHandler.formatter = java.util.logging.XMLFormatter
# 指定以追加方式添加日志内容
java.util.logging.FileHandler.append = true

## 向控制台输出的 handler 对象
# 指定 handler 对象的日志级别
java.util.logging.ConsoleHandler.level = INFO
# 指定 handler 对象的日志消息格式对象
java.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter
# 指定 handler 对象的字符集
java.util.logging.ConsoleHandler.encoding = UTF-8

# 指定日志消息格式
java.util.logging.SimpleFormatter.format = %4$s: %5$s [%1$tc]%n

## 自定义 Logger
com.itheima.handlers= java.util.logging.FileHandler
# 自定义 Logge r日志等级
com.itheima.level= INFO
# 忽略父日志设置
com.itheima.useParentHandlers=false
```

### 日志原理解析

1. 初始化 LogManager
    1. LogManager 加载 `logging.properties` 配置
    2. 添加 Logger 到 LogManager

2. 从单例 LogManager 获取 Logger
3. 设置级别 Level，并指定日志记录 LogRecord
4. Filter 提供了日志级别之外更细粒度的控制
5. Handler 是用来处理日志输出位置
6. Formatter 是用来格式化 LogRecord 的

![image-20240526203913582](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240526203913582.png)

## LOG4J 学习

Log4j 是 Apache 下的一款开源的日志框架，通过在项目中使用 Log4J，我们可以控制日志信息输出到控制台、文件、甚至是数据库中。我们可以控制每一条日志的输出格式，通过定义日志的输出级别，可以更灵活的控制日志的输出过程。方便项目的调试。

[官方网站](http://logging.apache.org/log4j/1.2/)

### Log4j 入门

1. 建立 maven 工程

2. 添加依赖

    ```xml
    <dependencies>
        <!-- log4j  -->
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>
    </dependencies>
    ```


3. java 代码

    ```java
    package com.itheima;
    
    import org.apache.log4j.BasicConfigurator;
    import org.apache.log4j.Logger;
    import org.junit.Test;
    
    public class Log4jTest {
        // 快速入门
        @Test
        public void testQuick() {
            // 初始化配置信息，在入门案例中暂不使用配置文件
            BasicConfigurator.configure();
            // 获取日志记录器对象
            Logger logger= Logger.getLogger(Log4jTest.class);
            // 日志记录的输出
            logger.info("hello log4j");
    
            // 日志级别
            logger.fatal("fatal");  // 严重错误，一般会造成系统崩溃并终止运行
            logger.error("error");  // 错误信息，不会影响系统运行
            logger.warn("warn");    // 警告信息，可能会发生问题
            logger.info("info");    // 运行消息，数据连接、网络链接、IO 操作等等
            logger.debug("debug");  // 调试信息，一般在开发中使用，记录程序变量参数传递信息等待。默认级别
            logger.trace("trace");  // 追踪信息，记录程序所有的流程信息
        }
    }
    ```


4. 日志的级别

    * 每个 Logger 都被了一个日志级别(log level)，用来控制日志信息的输出。日志级别从高到低分为：
      * `fatal` 指出每个严重的错误事件将会导致应用程序的退出。
      * `error` 指出虽然发生错误事件，但仍然不影响系统的继续运行。
      * `warn` 表明会出现潜在的错误情形。
      * `info` 一般和在粗粒度级别上，强调应用程序的运行全程。
      * `debug` 一般用于细粒度级别上，对调试应用程序非常有帮助。
      * `trace` 是程序追踪，可以用于输出程序运行中的变量，显示执行的流程。
    * 还有两个特殊的级别：
        * `OFF`，可用来关闭日志记录。
        * `ALL`，启用所有消息的日志记录。


注：一般只使用 4 个级别，优先级从高到低为 `ERROR` > `WARN` > `INFO` > `DEBUG`

### Log4j 组件

Log4J 主要由 Loggers （日志记录器）、Appenders（输出端）和 Layout（日志格式化器）组成。其中 Loggers 控制日志的输出级别与日志是否输出；Appenders 指定日志的输出方式（输出到控制台、文件等）；Layout 控制日志信息的输出格式。

#### Loggers

日志记录器，负责收集处理日志记录，实例的命名就是类“XX”的 full quailied name（类的全限定名），Logger 的名字大小写敏感，其命名有继承机制：例如：name 为 org.apache.commons 的 logger 会继承 name 为 org.apache 的 logger。

Log4J 中有一个特殊的 logger 叫做“root”，他是所有 logger 的根，也就意味着其他所有的 logger 都会直接或者间接地继承自 root。root logger 可以用 Logger.getRootLogger() 方法获取。

但是，自 log4j 1.2 版以来， Logger 类已经取代了 Category 类。对于熟悉早期版本的 log4j 的人来说，Logger 类可以被视为 Category 类的别名。

![image-20240526204121298](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240526204121298.png)

#### Appenders

Appender 用来指定日志输出到哪个地方，可以同时指定日志的输出目的地。Log4j 常用的输出目的地有以下几种：

| 输出端类型 | 作用 |
| ---------- | ---- |
| `ConsoleAppender` | 将日志输出到控制台 |
| `FileAppender` | 将日志输出到文件中 |
| `DailyRollingFileAppender` | 将日志输出到一个日志文件，并且每天输出到一个新的文件 |
| `RollingFileAppender` | 将日志信息输出到一个日志文件，并且指定文件的尺寸，当文件大小达到指定尺寸时，会自动把文件改名，同时产生一个新的文件 |
| `JDBCAppender` | 把日志信息保存到数据库中 |

#### Layouts

布局器 Layouts 用于控制日志输出内容的格式，让我们可以使用各种需要的格式输出日志。Log4j 常用的 Layouts:

| 格式化器类型 | 作用 |
| --- | --- |
| `HTMLLayout` |格式化日志输出为 HTML 表格形式 |
| `SimpleLayout` | 简单的日志输出格式化，打印的日志格式为(info - message) |
| `PatternLayout` | 最强大的格式化期，可以根据自定义格式输出日志，如果没有指定转换格式，就是用默认的转换格式 |
| `EnhancedPatternLayout` | `PatternLayout`代码有同步和其他问题，而这些问题在 `EnhancedPatternLayou` t 中不存在。应该优先使用`EnhancedPatternLayout` 而不是 `PatternLayout`。 |

#### Log4j 的内置日志记录

```java
// 开启 log4j 内置日志记录
LogLog.setInternalDebugging(true);
```

![image-20240526235159799](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240526235159799.png)

### Layout 的格式

在 `log4j.properties` 配置文件中，我们定义了日志输出级别与输出端，在输出端中分别配置日志的输出格式。

- log4j 采用类似 C 语言的 printf 函数的打印格式格式化日志信息，具体的占位符及其含义如下：%m   输出代码中指定的日志信息

    ```markdown
    %m   输出代码中指定的日志信息
    %p   输出优先级，即 DEBUG、INFO 等
    %n   换行符
    %r   输出自应用启动到输出该 log 信息耗费的毫秒数
    %c   输出打印语句所属的类的全名
    %t   输出产生该日志的线程全名
    %d   输出服务器当前时间，默认为 ISO8601，也可以指定格式，如：%d{yyyy年MM月dd日HH:mm:ss}
    %l   输出日志时间发生的位置，包括类名、线程、及在代码中的行数。如：Test.main(Test.java:10)
    %F   输出日志消息产生时所在的文件名称
    %L   输出代码中的行号
    %%   输出一个 "%" 字符
    ```

* 可以在 % 与字符之间加上修饰符来控制最小宽度、最大宽度和文本的对其方式。如：

    ```markdown
    %5c  输出 category 名称，最小宽度是 5，category < 5，默认的情况下右对齐
    %-5c 输出 category 名称，最小宽度是 5，category < 5，"-"号指定左对齐,会有空格
    %.5c 输出 category 名称，最大宽度是 5，category > 5，就会将左边多出的字符截掉，<5 不会有空格
    %20.30c category 名称 < 20 补空格，并且右对齐，> 30字符，就从左边将多出的字符截掉
    ```

### log4j 配置文件

Appender 输出到控制台，文件，数据库

```properties
# 指定 RootLogger 顶级父元素默认配置信息
# 指定日志级别为 trace，使用 appender 为 console，（后面可跟多个输出端，如trace,console,file）
log4j.rootLogger = trace,console

# 自定义 logger 对象设置
log4j.logger.com.itheima = info, file
log4j.logger.org.apache = error

# 指定控制台日志输出的输出端 appender
log4j.appender.console = org.apache.log4j.ConsoleAppender
# 指定消息格式 SimpleLayout\HTMLLayout\PatternLayout\xml.XMLLayout\EnhancedPatternLayout
log4j.appender.console.layout = org.apache.log4j.EnhancedPatternLayout
# 指定消息格式的内容
log4j.appender.console.layout.ConversionPattern = [%p]%r %c %t %l %d{yyyy-MM-dd HH:mm:ss.SSS} %m%n

# 日志文件输出的 appender 对象
log4j.appender.file = org.apache.log4j.FileAppender
# 指定消息格式 SimpleLayout\HTMLLayout\PatternLayout\xml.XMLLayout\EnhancedPatternLayout
log4j.appender.file.layout = org.apache.log4j.EnhancedPatternLayout
# 指定消息格式的内容
log4j.appender.file.layout.ConversionPattern = [%p]%r %c %t %l %d{yyyy-MM-dd HH:mm:ss.SSS} %m%n
# 指定日志文件的输出路径
log4j.appender.file.file = logs/log4j.log
# 指定日志文件的字符集
log4j.appender.file.encoding = UTF-8

# 按照文件大小拆分的 appender 对象
# 日志文件输出的 appender 对象
log4j.appender.rollFile = org.apache.log4j.RollingFileAppender
# 指定消息格式 SimpleLayout\HTMLLayout\PatternLayout\xml.XMLLayout\EnhancedPatternLayout
log4j.appender.rollFile.layout = org.apache.log4j.EnhancedPatternLayout
# 指定消息格式的内容
log4j.appender.rollFile.layout.ConversionPattern = [%p]%r %c %t %l %d{yyyy-MM-dd HH:mm:ss.SSS} %m%n
# 指定日志文件的输出路径
log4j.appender.rollFile.file = logs/log4j.log
# 指定日志文件的字符集
log4j.appender.rollFile.encoding = UTF-8
# 指定日志文件内容的大小
log4j.appender.rollFile.maxFileSize = 1MB
# 指定日志文件的数量，序号越小，日志越新
log4j.appender.rollFile.maxBackupIndex = 10

# 日志文件输出的 appender 对象
log4j.appender.dailyFile = org.apache.log4j.DailyRollingFileAppender
# 指定消息格式 SimpleLayout\HTMLLayout\PatternLayout\xml.XMLLayout\EnhancedPatternLayout
log4j.appender.dailyFile.layout = org.apache.log4j.EnhancedPatternLayout
# 指定消息格式的内容
log4j.appender.dailyFile.layout.ConversionPattern = [%p]%r %c %t %l %d{yyyy-MM-dd HH:mm:ss.SSS} %m%n
# 指定日志文件的输出路径
log4j.appender.dailyFile.file = logs/log4j.log
# 指定日志文件的字符集
log4j.appender.dailyFile.encoding = UTF-8
# 指定日期拆分规则
log4j.appender.dailyFile.datePattern = '.'yyyy-MM-dd-HH-mm-ss

#mysql
log4j.appender.logDB = org.apache.log4j.jdbc.JDBCAppender
log4j.appender.logDB.layout = org.apache.log4j.PatternLayout
log4j.appender.logDB.Driver = com.mysql.cj.jdbc.Driver
log4j.appender.logDB.URL = jdbc:mysql://localhost:3306/db2024?characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2B8&rewriteBatchedStatements=true&allowPublicKeyRetrieval=true
log4j.appender.logDB.User = root
log4j.appender.logDB.Password = 123456
log4j.appender.logDB.Sql = INSERT INTO log(project_name,create_date,level,category,file_name,thread_name,line,all_category,message) values('itcast','%d{yyyy-MM-dd HH:mm:ss}','%p','%c','%F','%t','%L','%l','%m')
```

```mysql
CREATE TABLE `log` (
	`log_id` INT ( 11 ) NOT NULL AUTO_INCREMENT,
	`project_name` VARCHAR ( 255 ) DEFAULT NULL COMMENT '项目名',
	`create_date` VARCHAR ( 255 ) DEFAULT NULL COMMENT '创建时间',
	`level` VARCHAR ( 255 ) DEFAULT NULL COMMENT '优先级',
	`category` VARCHAR ( 255 ) DEFAULT NULL COMMENT '所在类的全名',
	`file_name` VARCHAR ( 255 ) DEFAULT NULL COMMENT '输出日志消息产生时所在的文件名称 ',
	`thread_name` VARCHAR ( 255 ) DEFAULT NULL COMMENT '日志事件的线程名',
	`line` VARCHAR ( 255 ) DEFAULT NULL COMMENT '号行',
	`all_category` VARCHAR ( 255 ) DEFAULT NULL COMMENT '日志事件的发生位置',
	`message` VARCHAR ( 4000 ) DEFAULT NULL COMMENT '输出代码中指定的消息',
PRIMARY KEY ( `log_id` ) 
);
```

### 自定义 Logger

```properties
# 指定 RootLogger 顶级父元素默认配置信息
log4j.rootLogger = trace,console

# 自定义 logger 对象设置
log4j.logger.com.itheima = info, file
log4j.logger.org.apache = error
```

```java
package com.itheima;

import org.apache.log4j.Logger;
import org.junit.Test;

public class Log4jTest {
    @Test
    public void testQuick() throws InterruptedException {
        // 获取日志记录器对象
        Logger logger= Logger.getLogger(Log4jTest.class);
        // 日志级别
        logger.fatal("fatal");  // 严重错误，一般会造成系统崩溃并终止运行
        logger.error("error");  // 错误信息，不会影响系统运行
        logger.warn("warn");    // 警告信息，可能会发生问题
        logger.info("info");    // 运行消息，数据连接、网络链接、IO 操作等等
        logger.debug("debug");  // 调试信息，一般在开发中使用，记录程序变量参数传递信息等待。默认级别
        logger.trace("trace");  // 追踪信息，记录程序所有的流程信息

        Logger logger1= Logger.getLogger(Logger.class);
        logger1.fatal("fatal logger1");  // 严重错误，一般会造成系统崩溃并终止运行
        logger1.error("error logger1");  // 错误信息，不会影响系统运行
        logger1.warn("warn logger1");    // 警告信息，可能会发生问题
        logger1.info("info logger1");    // 运行消息，数据连接、网络链接、IO 操作等等
        logger1.debug("debug logger1");  // 调试信息，一般在开发中使用，记录程序变量参数传递信息等待。默认级别
        logger1.trace("trace logger1");  // 追踪信息，记录程序所有的流程信息
    }
}
```

## JCL 学习

- 全称为 Jakarta Commons Logging，是 Apache 提供的一个通用日志 API。
- 它是为 "所有的 Java 日志实现" 提供一个统一的接口，它自身也提供一个日志的实现，但是功能非常常弱(SimpleLog)。所以一般不会单独使用它。他允许开发人员使用不同的具体日志实现工具: Log4j, Jdk 自带的日志（JUL)。
- JCL 有两个基本的抽象类：Log（基本记录器）和 LogFactory（负责创建 Log 实例）。

![image-20240526204716617](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240526204716617.png)

### JCL 入门

1. 建立 maven 工程

2. 添加依赖

    ```xml
    <dependency>
        <groupId>commons-logging</groupId>
        <artifactId>commons-logging</artifactId>
        <version>1.2</version>
    </dependency>
    ```


3. 入门代码

    ```java
    package com.itheima;
    
    import org.apache.commons.logging.Log;
    import org.apache.commons.logging.LogFactory;
    import org.junit.Test;
    
    public class JCLTest {
        @Test
        public void testQuick() {
            // 获取 log 日志记录器对象
            Log log = LogFactory.getLog(JCLTest.class);
            // 日志记录输出
            log.info(log.getClass() + "\thello jcl");
        }
    }
    ```

4. 默认使用 `org.apache.commons.logging.impl.Jdk14Logger`，如果引入 log4j 依赖，则会使用 `org.apache.commons.logging.impl.Log4JLogger`

    ```xml
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>
    ```

**我们为什么要使用日志门面：**

1. 面向接口开发，不再依赖具体的实现类。减少代码的耦合
2. 项目通过导入不同的日志实现类，可以灵活的切换日志框架
3. 统一 API，方便开发者学习和使用

4. 统一配置便于项目日志的管理

### JCL 原理

1. 通过 LogFactory 动态加载 Log 实现类

![image-20240526204827326](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240526204827326.png)




2. 日志门面支持的日志实现数组

    ```java
    private static final String[] classesToDiscover = {
        "org.apache.commons.logging.impl.Log4JLogger",
        "org.apache.commons.logging.impl.Jdk14Logger", 
        "org.apache.commons.logging.impl.Jdk13LumberjackLogger",
        "org.apache.commons.logging.impl.SimpleLog"
    };
    ```


3. 获取具体的日志实现

    ```java
    for(int i=0; i<classesToDiscover.length && result == null; ++i) {
        result = createLogFromClass(classesToDiscover[i], logCategory, true);
    }
    ```
    

## 日志门面

当我们的系统变的更加复杂的时候，我们的日志就容易发生混乱。随着系统开发的进行，可能会更新不同的日志框架，造成当前系统中存在不同的日志依赖，让我们难以统一的管理和控制。就算我们强制要求所有的模块使用相同的日志框架，系统中也难以避免使用其他类似 spring,mybatis 等其他的第三方框架，它们依赖于我们规定不同的日志框架，而且他们自身的日志系统就有着不一致性，依然会出来日志体系的混乱。

所以我们需要借鉴 JDBC 的思想，为日志系统也提供一套门面，那么我们就可以面向这些接口规范来开发，避免了直接依赖具体的日志框架。这样我们的系统在日志中，就存在了日志的门面和日志的实现。

**常见的日志门面：**JCL、slf4j

**常见的日志实现：**JUL、logback、log4j、log4j2

日志门面和日志实现的关系：

![image-20240527220616095](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240527220616095.png)

日志框架出现的历史顺序：

log4j --> JUL --> JCL --> slf4j --> logback --> log4j2

## SLF4J 的使用

简单日志门面(Simple Logging Facade For Java) SLF4J 主要是为了给 Java 日志访问提供一套标准、规范的 API 框架，其主要意义在于提供接口，具体的实现可以交由其他日志框架，例如 log4j 和 logback 等。当然 slf4j 自己也提供了功能较为简单的实现，但是一般很少用到。对于一般的 Java 项目而言，日志框架会选择 slf4j-api 作为门面，配上具体的实现框架（log4j、logback 等），中间使用桥接器完成桥接。

[官方网站](https://www.slf4j.org/)

SLF4J 是目前市面上最流行的日志门面。现在的项目中，基本上都是使用 SLF4J 作为我们的日志系统。SLF4J 日志门面主要提供两大功能：

1. 日志框架的绑定

2. 日志框架的桥接

### SLF4J 入门

1. 添加依赖

    ```xml
    <!-- slf4j 日志门面 -->
    <!-- 其实引入了 slf4j 的各种日志实现后，可以不引入 slf4j-api，因为日志实现中包括 slf4j-api -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>1.7.26</version>
    </dependency>
    <!-- slf4j 内置的简单实现 -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>1.7.21</version>
    </dependency>
    ```


2. 编写代码

    ```java
    package com.itheima;
    
    import org.junit.Test;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    
    public class Slf4jTest {
        public static final Logger LOGGER = LoggerFactory.getLogger(Slf4jTest.class);
    
        // 快速入门
        @Test
        public void testQuick() {
            // 日志输出
            LOGGER.error("error");
            LOGGER.warn("warning");
            LOGGER.info("info");    // 默认级别
            LOGGER.debug("debug");
            LOGGER.trace("trace");
    
            // 使用占位符输出日志信息
            String name = "itheima";
            Integer age = 14;
            LOGGER.info("用户：{},{}", name, age);
    
            // 将系统的异常信息输出
            try {
                int i = 1/0;
            } catch (Exception e) {
                LOGGER.error("出现异常：", e);
            }
        }
    }
    ```

### 为什么要使用 SLF4J 作为日志门面？

1. 使用 SLF4J 框架，可以在部署时迁移到所需的日志记录框架。
2. SLF4J 提供了对所有流行的日志框架的绑定，例如 log4j，JUL，Simple logging 和 NOP。因此可以在部署时切换到任何这些流行的框架。
3. 无论使用哪种绑定，SLF4J 都支持参数化日志记录消息。由于 SLF4J 将应用程序和日志记录框架分离，因此可以轻松编写独立于日志记录框架的应用程序。而无需担心用于编写应用程序的日志记录框架。
4. SLF4J 提供了一个简单的 Java 工具，称为迁移器。使用此工具，可以迁移现有项目，这些项目使用日志框架（如 Jakarta Commons Logging（JCL）或 log4j 或 Java.util.logging(JUL))到 SLF4J。

### 绑定日志的实现(Binding)

如前所述，SLF4J 支持各种日志框架。SLF4J 发行版附带了几个称为“SLF4J 绑定”的 jar 文件，每个绑定对应一个受支持的框架。

**使用 slf4j 的日志绑定流程:**

1. 添加 slf4j-api 的依赖（<font color="red">可以不需要，因为日志实现框架应该都已经内置了 slf4j-api </font>）

2. 使用 slf4j 的 API 在项目中进行统一的日志记录

3. 绑定具体的日志实现框架
    1. 绑定已经实现了 slf4j 的日志框架，直接添加对应依赖
    2. 绑定没有实现 slf4j 的日志框架，先添加日志的适配器，再添加实现类的依赖

4. slf4j 有且仅有一个日志实现框架的绑定（**如果出现多个默认使用第一个依赖日志实现**）

**通过 maven 引入常见的日志实现框架：**

```xml
<!-- slf4j 日志门面 -->
<!-- 其实引入了 slf4j 的各种日志实现后，可以不引入 slf4j-api，因为日志实现中包括 slf4j-api -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.26</version>
</dependency>

<!-- logback 日志实现 -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>

<!--  nop 日志开关  -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-nop</artifactId>
    <version>1.7.25</version>
</dependency>

<!--  绑定 log4j 日志实现，需要导入适配器 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.12</version>
</dependency>

<!--  绑定 jul 日志实现，需要导入适配器  -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-jdk14</artifactId>
    <version>1.7.25</version>
</dependency>

<!-- 绑定 jcl 日志实现，需要导入适配器 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-jcl</artifactId>
    <version>1.7.27</version>
</dependency>
```


要切换日志框架，只需替换类路径上的 slf4j 绑定。例如，要从 `java.util.logging` 切换到 `log4j`，只需将 `slf4j-jdk14-1.7.27.jar` 替换为 `slf4j-log4j12-1.7.27.jar` 即可。

SLF4J 不依赖于任何特殊的类装载。实际上，每个 SLF4J 绑定在编译时都是硬连线的， 以使用**一个且只有一个**特定的日志记录框架。例如，`slf4j-log4j12-1.7.27.jar` 绑定在编译时绑定以使用 `log4j`。在您的代码中，除了 `slf4j-api-1.7.27.jar` 之外，您只需将您选择的一个且只有一个绑定放到相应的类路径位置。不要在类路径上放置多个绑定。以下是一般概念的图解说明。

![concrete-bindings](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/concrete-bindings.png)

### 桥接旧的日志框架(Bridging)

通常，您依赖的某些组件依赖于 SLF4J 以外的日志记录 API。您也可以假设这些组件在不久的将来不会切换到 SLF4J。为了解决这种情况，SLF4J 附带了几个桥接模块，这些模块将对 log4j、JCL 和 java.util.logging API 的调用重定向，就好像它们是对 SLF4J API 一样。

桥接解决的是项目中日志的遗留问题，当系统中存在之前的日志 API，可以通过桥接转换到 slf4j 的实现

1. 先去除之前老的日志框架的依赖
2. 添加 SLF4J 提供的桥接组件
3. 为项目添加 SLF4J 的具体实现

![legacy](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/legacy.png)

迁移的方式：

如果我们要使用 SLF4J 的桥接器，替换原有的日志框架，那么我们需要做的第一件事情，就是删除掉原有项目中的日志框架的依赖。然后替换成 SLF4J 提供的桥接器。

```xml
<!-- 配置 log4j 的桥接器 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>log4j-over-slf4j</artifactId>
    <version>1.7.25</version>
</dependency>

<!--  配置 jul 的桥接器 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>jul-to-slf4j</artifactId>
    <version>1.7.27</version>
</dependency>

<!--  配置 jcl 的桥接器 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>jcl-over-slf4j</artifactId>
    <version>1.7.27</version>
</dependency>
```

注意问题：

1. `jcl-over-slf4j.jar` 和 `slf4j-jcl.jar` 不能同时部署。前一个 jar 文件将导致 JCL 将日志系统的选择委托给 SLF4J，后一个 jar 文件将导致 SLF4J 将日志系统的选择委托给 JCL，从而导致**无限循环**。
2. `log4j-over-slf4j.jar` 和 `slf4j-log4j12.jar` 不能同时出现

3. `jul-to-slf4j.jar` 和 `slf4j-jdk14.jar` 不能同时出现
4. 所有的桥接都只对 Logger 日志记录器对象有效，如果程序中调用了内部的配置类或者是 Appender,Filter 等对象，将无法产生效果。

### SLF4J 原理解析

1. SLF4J 通过 LoggerFactory 加载日志具体的实现对象。
2. LoggerFactory 在初始化的过程中，会通过 performInitialization() 方法绑定具体的日志实现。
3. 在绑定具体实现的时候，通过类加载器，加载 `org/slf4j/impl/StaticLoggerBinder.class`。
4. 所以，只要是一个日志实现框架，在 `org.slf4j.impl` 包中提供一个自己的 StaticLoggerBinder 类，在其中提供具体日志实现的 LoggerFactory 就可以被 SLF4J 所加载。

## Logback 的使用

Logback 是由 log4j 创始人设计的另一个开源日志组件，性能比 log4j 要好。

[官方网站](https://logback.qos.ch/index.html)


Logback 主要分为三个模块：

- `logback-core`：其它两个模块的基础模块
- `logback-classic`：它是 log4j 的一个改良版本，同时它完整实现了 slf4j API
- `logback-access`：访问模块与 Servlet 容器集成提供通过 Http 来访问日志的功能

后续的日志代码都是通过 SLF4J 日志门面搭建日志系统，所以在代码是没有区别，主要是通过修改配置文件和 pom.xml 依赖

### logback 入门

1. 添加依赖

    ```xml
    <!-- logback 日志实现 -->
    <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>1.2.3</version>
    </dependency>
    ```
    
2. java 代码

    ```java
    // 定义 log4j 日志记录器
    public static final Logger LOGGER = LoggerFactory.getLogger(LogbackTest.class);
    @Test
    public void testQuick() {
        // 日志输出
        LOGGER.error("error");
        LOGGER.warn("warning");
        LOGGER.info("info");
        LOGGER.debug("debug");   // 默认级别
        LOGGER.trace("trace");
    }
    ```

### logback 配置

logback 会依次读取以下类型配置文件：

- `logback.groovy`
- `logback-test.xml`
- `logback.xml`
- 如果均不存在会采用默认配置

1. logback 组件之间的关系

    1. Logger：日志的记录器，把它关联到应用的对应的 context 上后，主要用于存放日志对象，也可以定义日志类型、级别。
    2. Appender：用于指定日志输出的目的地，目的地可以是控制台、文件、数据库等等。
    3. Layout：负责把事件转换成字符串，格式化的日志信息的输出。在 logback 中 Layout 对象被封装在 encoder 中。

2. 基本配置信息

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <configuration>
        <!--
            日志输出格式：
                %-5level
                %d{yyyy-MM-dd HH:mm:ss.SSS}日期
                %c类的完整名称
                %M为method
                %L为行号
                %thread线程名称
                %m或者%msg为信息
                %n换行
        -->
        <!-- 配置集中管理属性，我们可以直接改属性的 value 值，格式：${name} -->
        <!-- 格式化输出：%d 表示日期，%thread 表示线程名，%-5level：级别从左显示 5 个字符宽度，%msg：日志消息，%n 是换行符 -->
        <property name="pattern" value="[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c %M %L [%thread] %m%n" ></property>
    
        <!--
            Appender: 设置日志信息的去向,常用的有以下几个
                ch.qos.logback.core.ConsoleAppender (控制台)
                ch.qos.logback.core.rolling.RollingFileAppender (文件大小到达指定尺寸的时候产生一个新文件)
                ch.qos.logback.core.FileAppender (文件）
        -->
        <!-- 控制台输出的 appender -->
        <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
            <!--   控制输出流对象 默认 System.out 改为 System.err   -->
            <target>System.err</target>
            <!-- 日志消息格式配置 -->
            <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
                <pattern>${pattern}</pattern>
            </encoder>
        </appender>
    
        <!--
           用来设置某一个包或者具体的某一个类的日志打印级别、以及指定 <appender>。
           <logger> 仅有一个 name 属性，一个可选的 level 和一个可选的 additivity 属性
           name: 用来指定受此 logger 约束的某一个包或者具体的某一个类。
           level: 用来设置打印级别，大小写无关：TRACE, DEBUG, INFO, WARN, ERROR, ALL 和 OFF，
                  如果未设置此属性，那么当前 logger 将会继承上级的级别。
           additivity: 是否向上级 logger 传递打印信息。默认是 true。
           <logger> 可以包含零个或多个 <appender-ref> 元素，标识这个 appender 将会添加到这个 logger
        -->
        <!-- root logger 配置，也是 <logger> 元素，但是它是根 logger。默认 debug-->
        <root level="ALL" >
            <appender-ref ref="console"></appender-ref>
        </root>
    </configuration>
    ```


3. FileAppender 配置

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <configuration>
        <!-- 格式化输出：%d 表示日期，%thread 表示线程名，%-5level：级别从左显示 5 个字符宽度，%msg：日志消息，%n 是换行符 -->
        <property name="pattern" value="[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c %M %L [%thread] %m%n" ></property>
        <property name="log_dir" value="logs"></property>
    
        <!-- 控制台输出的 appender -->
        <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
            <!--   控制输出流对象 默认 System.out 改为 System.err   -->
            <target>System.err</target>
            <!-- 日志消息格式配置 -->
            <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
                <pattern>${pattern}</pattern>
            </encoder>
        </appender>
    
        <!-- 日志文件输出的 appender -->
        <appender name="file" class="ch.qos.logback.core.FileAppender">
            <!-- 日志文件保存路径 -->
            <file>${log_dir}/logback.log</file>
            <!-- 日志消息格式配置 -->
            <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
                <pattern>${pattern}</pattern>
            </encoder>
        </appender>
    
        <!-- html 格式日志文件输出 appender -->
        <appender name="htmlFile" class="ch.qos.logback.core.FileAppender">
            <!-- 日志文件保存路径 -->
            <file>${log_dir}/logback.html</file>
            <!-- html 消息格式配置 -->
            <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
                <layout class="ch.qos.logback.classic.html.HTMLLayout">
                    <pattern>%-5level%d{yyyy-MM-dd HH:mm:ss.SSS}%c%M%L%thread%m</pattern>
                </layout>
            </encoder>
        </appender>
    
        <!-- root logger 配置，也是 <logger> 元素，但是它是根 logger。默认 debug-->
        <root level="ALL" >
            <appender-ref ref="console"/>
            <appender-ref ref="file"/>
            <appender-ref ref="htmlFile"/>
        </root>
    </configuration>
    ```
    
4. RollingFileAppender 配置

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <configuration>
        <!-- 格式化输出：%d 表示日期，%thread 表示线程名，%-5level：级别从左显示 5 个字符宽度，%msg：日志消息，%n 是换行符 -->
        <property name="pattern" value="[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c %M %L [%thread] %m%n" ></property>
        <property name="log_dir" value="logs"></property>
    
        <!-- 控制台输出的 appender -->
        <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
            <!--   控制输出流对象 默认 System.out 改为 System.err   -->
            <target>System.err</target>
            <!-- 日志消息格式配置 -->
            <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
                <pattern>${pattern}</pattern>
            </encoder>
        </appender>
    
        <!-- 日志拆分和归档压缩的 appender 对象 -->
        <appender name="rollFile" class="ch.qos.logback.core.rolling.RollingFileAppender">
            <!-- 日志文件保存路径 -->
            <file>${log_dir}/roll_logback.log</file>
            <!-- 日志消息格式配置 -->
            <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
                <pattern>${pattern}</pattern>
            </encoder>
            <!-- 指定拆分规则 -->
            <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
                <!-- 按照时间和压缩格式声明拆分的文件名 -->
                <fileNamePattern>${log_dir}/rolling.%d{yyyy-MM-dd-HH-mm-ss}-%i.log.gz</fileNamePattern>
                <!-- 按照文件大小拆分 -->
                <maxFileSize>1MB</maxFileSize>
                <!-- 要保留的存档文件的最大数量，异步删除旧文件 -->
                <maxHistory>10</maxHistory>
            </rollingPolicy>
        </appender>
    
        <!-- root logger 配置，也是 <logger> 元素，但是它是根 logger。默认 debug-->
        <root level="ALL" >
            <appender-ref ref="console"/>
            <appender-ref ref="rollFile"/>
        </root>
    </configuration>
    ```
    
5. Filter 和异步日志配置

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <configuration>
        <!-- 格式化输出：%d 表示日期，%thread 表示线程名，%-5level：级别从左显示 5 个字符宽度，%msg：日志消息，%n 是换行符 -->
        <property name="pattern" value="[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c %M %L [%thread] %m%n" ></property>
        <property name="log_dir" value="logs"></property>
    
        <!-- 控制台输出的 appender -->
        <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
            <!--   控制输出流对象 默认 System.out 改为 System.err   -->
            <target>System.err</target>
            <!-- 日志消息格式配置 -->
            <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
                <pattern>${pattern}</pattern>
            </encoder>
        </appender>
    
        <!-- 日志拆分和归档压缩的 appender 对象 -->
        <appender name="rollFile" class="ch.qos.logback.core.rolling.RollingFileAppender">
            <!-- 日志文件保存路径 -->
            <file>${log_dir}/roll_logback.log</file>
            <!-- 日志消息格式配置 -->
            <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
                <pattern>${pattern}</pattern>
            </encoder>
            <!-- 指定拆分规则 -->
            <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
                <!-- 按照时间和压缩格式声明拆分的文件名 -->
                <fileNamePattern>${log_dir}/rolling.%d{yyyy-MM-dd}-%i.log.gz</fileNamePattern>
                <!-- 按照文件大小拆分 -->
                <maxFileSize>1MB</maxFileSize>
                <!-- 要保留的存档文件的最大数量，异步删除旧文件 -->
                <maxHistory>10</maxHistory>
            </rollingPolicy>
            <!-- 日志级别过滤器 -->
            <filter class="ch.qos.logback.classic.filter.LevelFilter">
                <!-- 日志过滤规则 -->
                <level>ERROR</level>
                <onMatch>ACCEPT</onMatch>
                <onMismatch>DENY</onMismatch>
            </filter>
        </appender>
    
        <!-- 异步日志 -->
        <appender name="async" class="ch.qos.logback.classic.AsyncAppender">
            <!-- 指定某个具体的 appender -->
            <appender-ref ref="rollFile"></appender-ref>
        </appender>
    
        <!-- root logger 配置，也是 <logger> 元素，但是它是根 logger。默认 debug-->
        <root level="ALL" >
            <appender-ref ref="console"/>
            <appender-ref ref="async"/>
        </root>
    
        <!--
           用来设置某一个包或者具体的某一个类的日志打印级别、以及指定 <appender>。
           <logger> 仅有一个 name 属性，一个可选的 level 和一个可选的 additivity 属性
           name: 用来指定受此 logger 约束的某一个包或者具体的某一个类。
           level: 用来设置打印级别，大小写无关：TRACE, DEBUG, INFO, WARN, ERROR, ALL 和 OFF，
                  如果未设置此属性，那么当前 logger 将会继承上级的级别。
           additivity: 是否向上级 logger 传递打印信息。默认是 true。
           <logger> 可以包含零个或多个 <appender-ref> 元素，标识这个 appender 将会添加到这个 logger
        -->
        <!-- 自定义 logger 对象 -->
        <logger name="com.itheima" level="info" additivity="false">
            <appender-ref ref="console"/>
        </logger>
    </configuration>
    ```


6. 官方提供的 `log4j.properties` 转换成 `logback.xml`

    [https://logback.qos.ch/translator/](https://logback.qos.ch/translator/)

### logback-access 的使用

logback-access 模块与 Servlet 容器（如 Tomcat 和 Jetty）集成，以提供 HTTP 访问日志功能。我们可以使用 logback-access 模块来替换 tomcat 的访问日志。

1. 将 `logback-access.jar` 与 `logback-core.jar` 复制到 `$TOMCAT_HOME/lib/` 目录下

2. 修改 `$TOMCAT_HOME/conf/server.xml` 中的 Host 元素中添加：

    ```xml
    <!-- Access log processes all example.
         Documentation at: /docs/config/valve.html
         Note: The pattern used is equivalent to using pattern="common" -->
    <!-- <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
           prefix="localhost_access_log" suffix=".txt"
           pattern="%h %l %u %t &quot;%r&quot; %s %b" /> -->
    <Valve className="ch.qos.logback.access.tomcat.LogbackValve" />
    ```


3. logback 默认会在 `$TOMCAT_HOME/conf` 下查找文件 `logback-access.xml`

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
      <!-- always a good activate OnConsoleStatusListener -->
      <statusListener class="ch.qos.logback.core.status.OnConsoleStatusListener"/> 
      
      <property name="LOG_DIR" value="${catalina.base}/logs"/>
     
      <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_DIR}/access.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
          <fileNamePattern>access.%d{yyyy-MM-dd}.log.zip</fileNamePattern>
        </rollingPolicy>
     
        <encoder>
          <pattern>combined</pattern>
        </encoder>
      </appender>
      
      <appender-ref ref="FILE"/>
    </configuration>
    ```
    
4. 官方配置： [https://logback.qos.ch/access.html#configuration](https://logback.qos.ch/access.html#configuration)

## log4j2 的使用

Apache Log4j 2 是对 Log4j 的升级版，参考了 logback 的一些优秀的设计，并且修复了一些问题，因此带来了一些重大的提升，主要有：

- 异常处理，在 logback 中，Appender 中的异常不会被应用感知到，但是在 log4j2 中，提供了一些异常处理机制。
- 性能提升， log4j2 相较于 log4j 和 logback 都具有很明显的性能提升，后面会有官方测试的数据。
- 自动重载配置，参考了 logback 的设计，当然会提供自动刷新参数配置，最实用的就是我们在生产上可以动态的修改日志的级别而不需要重启应用。
- 无垃圾机制，log4j2 在大部分情况下，都可以使用其设计的一套无垃圾机制，避免频繁的日志收集导致的 jvm gc。

官网： [https://logging.apache.org/log4j/2.x/](https://logging.apache.org/log4j/2.x/)

### Log4j2 入门

目前市面上最主流的日志门面就是 SLF4J，虽然 Log4j2 也是日志门面，因为它的日志实现功能非常强大，性能优越。所以大家一般还是将 Log4j2 看作是日志的实现，Slf4j + Log4j2 应该是未来的大势所趋。

1. 添加依赖

    ```xml
    <!-- log4j2 日志门面 API （可不添加，log4j-core 中以引入 log4j-api -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-api</artifactId>
        <version>2.12.1</version>
    </dependency>
    <!-- log4j2 日志实现 -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-core</artifactId>
        <version>2.12.1</version>
    </dependency>
    ```

2. JAVA 代码

    ```java
    package com.itheima;
    
    import org.apache.logging.log4j.LogManager;
    import org.apache.logging.log4j.Logger;
    import org.junit.Test;
    
    public class Log4j2Test {
        // 定义日志记录器对象
        public static final Logger LOGGER = LogManager.getLogger(Log4j2Test.class);
        @Test
        public void testQuick() {
            for (int i = 0; i < 10000; i++) {
                // 日志消息输出
                LOGGER.fatal("fatal");
                LOGGER.error("error");  // 默认级别
                LOGGER.warn("warn");
                LOGGER.info("info");
                LOGGER.debug("debug");
                LOGGER.trace("trace");
            }
        }
    }
    ```


3. **使用 slf4j 作为日志的门面，使用 log4j2 作为日志的实现（常用方式）**

    ```xml
    <!-- 使用 log4j2 的适配器进行绑定 -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-slf4j-impl</artifactId>
        <version>2.9.1</version>
    </dependency>
    ```
    
    内部已有 `log4j-api`、`log4j-core`、`slf4j-api`，不需要再引入
    
    ![image-20240528222930908](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240528222930908.png)

### Log4j2 配置

log4j2 默认加载 classpath 下的 `log4j2.xml` 文件中的配置。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!--
    status="warn"       日志框架本身的输出日志级别
    monitorInterval="5" 自动加载配置文件的间隔时间，不低于 5 秒
-->
<Configuration status="warn" monitorInterval="5">
    <!-- 集中配置属性进行管理，使用时通过：${name} -->
    <properties>
        <property name="LOG_HOME">logs</property>
        <property name="pattern">[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%-5level] %l %c{36} - %m%n</property>
    </properties>

    <!-- 日志处理 -->
    <Appenders>
        <!-- 控制台输出 appender，如果想要红色，可以 target="SYSTEM_ERR" -->
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] [%-5level] %c{36}:%L --- %m%n" />
        </Console>

        <!-- 日志文件输出 appender -->
        <File name="file" fileName="${LOG_HOME}/myfile.log">
            <PatternLayout pattern="${pattern}" />
        </File>
        
        <!-- 使用随机读写流的日志文件输出 appender，性能提高 -->
        <RandomAccessFile name="accessFile" fileName="${LOG_HOME}/myAcclog.log">
            <PatternLayout pattern="${pattern}" />
        </RandomAccessFile>

        <!-- 按照一定规则拆分的日志文件的 appender -->
        <RollingFile name="rollingFile" fileName="${LOG_HOME}/myrolllog.log"
                     filePattern="${LOG_HOME}/$${date:yyyy-MM-dd}/myrolllog-%d{yyyy-MM-dd-HH-mm-ss}-%i.log"
                     filePermissions="rw-r--r--" >
            <!-- 日志级别过滤器 -->
            <ThresholdFilter level="debug" onMatch="ACCEPT" onMismatch="DENY" />
            <!-- 日志消息格式 -->
            <PatternLayout pattern="${pattern}" />
            <Policies>
                <!-- 在系统启动时，触发拆分规则，生成一个新的日志文件 -->
                <OnStartupTriggeringPolicy />
                <!-- 按照文件大小进行拆分，10MB -->
                <SizeBasedTriggeringPolicy size="10 MB" />
                <!-- 按照时间节点拆分，规则根据 filePattern 定义的 -->
                <!-- 根据日期模式中最具体的时间单位，翻转应该多久发生一次。
                例如，以小时为最具体项目的日期模式和每4小时发生4次滚动的增量。
                默认值为1。-->
                <TimeBasedTriggeringPolicy />
            </Policies>
            <!-- 在同一个目录下，文件的个数限定为 30 个，超过进行覆盖 -->
            <!-- min: 计数器的最小值。缺省值为1。
                 max： 计数器的最大值。一旦达到这个值，旧的存档将在随后的滚动中被删除。默认值为7。-->
            <DefaultRolloverStrategy max="30" />
        </RollingFile>
    </Appenders>
    
    <!-- logger 定义 -->
    <Loggers>
        <!-- 使用 rootLogger 配置，日志级别 level="trace" -->
        <Root level="trace">
            <!-- 指定日志使用的输出端处理器 -->
            <AppenderRef ref="Console"></AppenderRef>
            <AppenderRef ref="file"></AppenderRef>
            <AppenderRef ref="accessFile"></AppenderRef>
            <AppenderRef ref="rollingFile"></AppenderRef>
        </Root>
    </Loggers>
</Configuration>
```

### Log4j2 异步日志

**异步日志：log4j2 最大的特点就是<font color="red">异步日志</font>，其性能的提升主要也是从异步日志中受益，我们来看看如何使用 log4j2 的异步日志。**

- 同步日志

    ![image-20240527221702187](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240527221702187.png)

- 异步日志

    ![image-20240527221732872](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240527221732872.png)


​	Log4j2 提供了两种实现日志的方式，一个是通过 `AsyncAppender`，一个是通过 `AsyncLogger`，分别对应前面我们说的 Appender 组件和 Logger 组件。

注意：配置异步日志需要添加依赖

```xml
<!-- 异步日志依赖 -->
<dependency>
    <groupId>com.lmax</groupId>
    <artifactId>disruptor</artifactId>
    <version>3.3.4</version>
</dependency>
```


1. AsyncAppender 方式

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!--
        status="warn"       日志框架本身的输出日志级别
        monitorInterval="5" 自动加载配置文件的间隔时间，不低于 5 秒
    -->
    <Configuration status="warn" monitorInterval="5">
        <!-- 集中配置属性进行管理，使用时通过：${name} -->
        <properties>
            <property name="LOG_HOME">logs</property>
            <property name="pattern">[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%-5level] %l %c{36} - %m%n</property>
        </properties>
    
        <!-- 日志处理 -->
        <Appenders>
            <!-- 日志文件输出 appender -->
            <File name="file" fileName="${LOG_HOME}/myfile.log">
                <PatternLayout pattern="${pattern}" />
            </File>
    
            <Async name="Async">
                <AppenderRef ref="file" />
            </Async>
        </Appenders>
    
        <!-- logger 定义 -->
        <Loggers>
            <!-- 使用 rootLogger 配置，日志级别 level="trace" -->
            <Root level="trace">
                <!-- 指定日志使用的输出端处理器 -->
                <!-- 使用异步 Appender -->
                <AppenderRef ref="Async"></AppenderRef>
            </Root>
        </Loggers>
    </Configuration>
    ```

2. AsyncLogger 方式

    **AsyncLogger 才是 log4j2 的重头戏，也是官方推荐的异步方式**。它可以使得调用 Logger.log 返回的更快。你可以有两种选择：全局异步和混合异步。

    - **全局异步**就是，所有的日志都异步的记录，在配置文件上不用做任何改动，只需要添加一个 `log4j2.component.properties` 配置；[log4j2 System Properties](https://logging.apache.org/log4j/2.x/manual/configuration.html#system-properties)

        ```properties
        <!-- 使所有记录器异步 -->
        Log4jContextSelector=org.apache.logging.log4j.core.async.AsyncLoggerContextSelector
        <!-- Log4j2 配置文件的路径。也可以包含一个以逗号分隔的配置文件名列表。可能包含URL。-->
        log4j2.configurationFile=config/log/log4j2.xml
        <!-- 如果未指定工厂，则记录器使用默认消息工厂：org.apache.logging.log4j.message.ParameterizedMessageFactory or org.apache.logging.log4j.message. ReusableMessageFactory in garbage-free mode -->
        log4j2.messageFactory=AAA.loghelper.log4j2.message.GeekPlusMessageFactory
        ```
    
    - **混合异步**就是，你可以在应用中同时使用同步日志和异步日志，这使得日志的配置方式更加灵活。
    
        ```xml
        <?xml version="1.0" encoding="UTF-8" ?>
        <Configuration status="warn" monitorInterval="5">
            <!-- 集中配置属性进行管理，使用时通过：${name} -->
            <properties>
                <property name="LOG_HOME">logs</property>
                <property name="pattern">[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%-5level] %l %c{36} - %m%n</property>
            </properties>
        
            <!-- 日志处理 -->
            <Appenders>
                <!-- 控制台输出 appender，如果想要红色，可以 target="SYSTEM_ERR" -->
                <Console name="Console" target="SYSTEM_OUT">
                    <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] [%-5level] %c{36}:%L --- %m%n" />
                </Console>
            </Appenders>
        
            <!-- logger 定义 -->
            <Loggers>
                <!-- 自定义异步 logger 对象
                    includeLocation="false" 关闭日志记录的行号信息
                    additivity="false" 不再继承 rootLogger 对象
                 -->
                <AsyncLogger name="com.itheima" level="trace" includeLocation="false" additivity="false">
                    <AppenderRef ref="Console" />
                </AsyncLogger>
        
                <!-- 使用 rootLogger 配置，日志级别 level="trace" -->
                <Root level="trace">
                    <!-- 指定日志使用的输出端处理器 -->
                    <AppenderRef ref="Console"></AppenderRef>
                </Root>
            </Loggers>
        </Configuration>
        ```
        
        如上配置： `com.itheima` 日志是异步的，`root` 日志是同步的。


使用异步日志需要注意的问题：

1. 如果使用异步日志，AsyncAppender、AsyncLogger 和全局日志，不要同时出现。性能会和 AsyncAppender 一致，降至最低。
2. 设置 `includeLocation=false`，打印位置信息会急剧降低异步日志的性能，比同步日志还要慢。

### Log4j2 的性能

Log4j2 最牛的地方在于异步输出日志时的性能表现，Log4j2 在多线程的环境下吞吐量与 Log4j 和 Logback 的比较如下图。下图比较中 Log4j2 有三种模式：

1. 全局使用异步模式；
2. 部分 Logger 采用异步模式；
3. 异步 Appender。

可以看出在前两种模式下，Log4j2 的性能较之 Log4j 和 Logback 有很大的优势。

![image-20240527221941900](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240527221941900.png)

**无垃圾记录**

- 垃圾收集暂停是延迟峰值的常见原因，并且对于许多系统而言，花费大量精力来控制这些暂停。
- 许多日志库（包括以前版本的 Log4j）在稳态日志记录期间分配临时对象，如日志事件对象，字符串，字符数组，字节数组等。这会对垃圾收集器造成压力并增加 GC 暂停发生的频率。
- 从版本 2.6 开始，默认情况下 Log4j 以“无垃圾”模式运行，其中重用对象和缓冲区，并且尽可能不分配临时对象。还有一个“低垃圾”模式，它不是完全无垃圾，但不使用 ThreadLocal 字段。
- Log4j 2.6 中的无垃圾日志记录部分通过重用 ThreadLocal 字段中的对象来实现，部分通过在将文本转换为字节时重用缓冲区来实现。

**使用 Log4j 2.5：内存分配速率 809 MB /秒，141 个无效集合。**

![image-20240527222009953](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240527222009953.png)

**Log4j 2.6 没有分配临时对象：0（零）垃圾回收。**

![image-20240527222020081](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240527222020081.png)


有两个单独的系统属性可用于手动控制 Log4j 用于避免创建临时对象的机制：

- `log4j2.enableThreadlocals` - 如果“true”（非 Web 应用程序的默认值）对象存储在 ThreadLocal 字段中并重新使用，否则将为每个日志事件创建新对象。
- `log4j2.enableDirectEncoders` - 如果将“true”（默认）日志事件转换为文本，则将此文本转换为字节而不创建临时对象。注意： 由于共享缓冲区上的同步，在此模式下多线程应用程序的同步日志记录性能可能更差。如果您的应用程序是多线程的并且日志记录性能很重要，请考虑使用异步记录器。

## SpringBoot 中的日志使用

springboot 框架在企业中的使用越来越普遍，springboot 日志也是开发中常用的日志系统。springboot 默认就是使用 SLF4J 作为日志门面，logback 作为日志实现来记录日志。

### SpringBoot 中的日志设计

springboot 中的日志，当引入 `spring-boot-starter-web`时就引入了 `spring-boot-starter-logging`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-logging</artifactId>
</dependency>
```


依赖关系图：

![image-20240527222123710](Java%E6%97%A5%E5%BF%97%E7%83%AD%E9%97%A8%E6%A1%86%E6%9E%B6.assets/image-20240527222123710.png)

总结：

1. springboot 底层默认使用 logback 作为日志实现。
2. 使用了 SLF4J 作为日志门面。
3. 将 JUL 也转换成 slf4j。
4. 也可以使用 log4j2 作为日志门面，但是最终也是通过 slf4j 调用 logback

### SpringBoot 日志使用

1. 在 springboot 中测试打印日志

    ```java
    package com.itheima;
    
    import org.apache.logging.log4j.LogManager;
    import org.apache.logging.log4j.Logger;
    import org.junit.Test;
    
    public class Log4j2Test {
        // 定义日志记录器对象
        public static final Logger LOGGER = LogManager.getLogger(Log4j2Test.class);
        @Test
        public void testQuick() {
            for (int i = 0; i < 10000; i++) {
                // 日志消息输出
                LOGGER.fatal("fatal");
                LOGGER.error("error");  // 默认级别
                LOGGER.warn("warn");
                LOGGER.info("info");
                LOGGER.debug("debug");
                LOGGER.trace("trace");
            }
        }
    }
    ```


2. 修改默认日志配置 `application.yml`

    ```yml
    logging:
      # 指定自定义 logger 对象日志级别
      level:
        com:
          itheima: trace
      pattern:
        # 指定控制台输出消息格式
        console: "[%-5level] %d{yyyy-MM-dd HH:mm:ss} %c [%thread] === %m%n"
        # 指定日志文件消息格式
        file: "[%-5level] %d{yyyy-MM-dd HH:mm:ss} %c [%thread] === %m%n"
      # 指定存放日志文件的具体路径
      file:
    #    name: logs/springboot/springboot.log
        # 指定日志文件的存放的目录，默认的文件名 spring.log
        path: logs/springboot
    
    ```

3. 指定配置

    给类路径下放上每个日志框架自己的配置文件；SpringBoot 就不使用默认配置的了

    |日志框架 | 配置文件 |
    | --- | --- |
    | Logback | logback-spring.xml , logback.xml |
    | Log4j2 | log4j2-spring.xml ， log4j2.xml |
    | JUL | logging.properties |

​	`logback.xml`：直接就被日志框架识别了

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <property name="pattern" value="[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c %M %L [%thread] %m%n" ></property>

    <!-- 控制台输出的 appender -->
    <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
        <!--   控制输出流对象 默认 System.out 改为 System.err   -->
        <target>System.err</target>
        <!-- 日志消息格式配置 -->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>${pattern}</pattern>
        </encoder>
    </appender>

    <!-- 自定义 logger 对象 -->
    <logger name="com.itheima.springboot_log" level="info" additivity="false">
        <appender-ref ref="console"/>
    </logger>
</configuration>
```


4. 使用 SpringBoot 解析日志配置

    `logback-spring.xml`：由 SpringBoot 解析日志配置

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <configuration>
        <property name="pattern" value="[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c %M %L [%thread] ======== %m%n" ></property>
    
        <!-- 控制台输出的 appender -->
        <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
            <!--   控制输出流对象 默认 System.out 改为 System.err   -->
            <target>System.err</target>
            <!-- 日志消息格式配置 -->
            <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
                <springProfile name="dev">
                    <pattern>${pattern}</pattern>
                </springProfile>
                <springProfile name="pro">
                    <pattern>[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c %M %L [%thread] -------- %m%n</pattern>
                </springProfile>
            </encoder>
        </appender>
    
        <!-- 自定义 logger 对象 -->
        <logger name="com.itheima.springboot_log" level="info" additivity="false">
            <appender-ref ref="console"/>
        </logger>
    </configuration>
    ```
    
    `application.yml`
    
    ```yml
    # 指定项目使用的具体环境
    spring:
      profiles:
        active: pro
    ```


5. 将日志切换为 log4j2

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
            <!-- 排除 logback 日志实现 -->
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-logging</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    
    <!-- 使用 log4j2 的日志启动器 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-log4j2</artifactId>
    </dependency>
    ```
    
    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <Configuration status="warn" monitorInterval="5">
        <!-- 集中配置属性进行管理，使用时通过：${name} -->
        <properties>
            <property name="LOG_HOME">logs</property>
            <property name="pattern">[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%-5level] %l %c{36} - %m%n</property>
        </properties>
    
        <!-- 日志处理 -->
        <Appenders>
            <!-- 控制台输出 appender，如果想要红色，可以 target="SYSTEM_ERR" -->
            <Console name="Console" target="SYSTEM_OUT">
                <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] [%-5level] %c{36}:%L --- %m%n" />
            </Console>
    
            <!-- 按照一定规则拆分的日志文件的 appender -->
            <RollingFile name="rollingFile" fileName="${LOG_HOME}/myrolllog.log"
                         filePattern="${LOG_HOME}/$${date:yyyy-MM-dd}/myrolllog-%d{yyyy-MM-dd-HH-mm-ss}-%i.log">
                <!-- 日志级别过滤器 -->
                <ThresholdFilter level="info" onMatch="ACCEPT" onMismatch="DENY" />
                <!-- 日志消息格式 -->
                <PatternLayout pattern="${pattern}" />
                <Policies>
                    <!-- 在系统启动时，触发拆分规则，生成一个新的日志文件 -->
                    <OnStartupTriggeringPolicy />
                    <!-- 按照文件大小进行拆分，10MB -->
                    <SizeBasedTriggeringPolicy size="10 MB" />
                    <!-- 按照时间节点拆分，规则根据 filePattern 定义的 -->
                    <TimeBasedTriggeringPolicy />
                </Policies>
                <!-- 在同一个目录下，文件的个数限定为 30 个，超过进行覆盖 -->
                <DefaultRolloverStrategy max="30" />
            </RollingFile>
        </Appenders>
    
        <!-- logger 定义 -->
        <Loggers>
            <!-- 使用 rootLogger 配置，日志级别 level="trace" -->
            <Root level="info">
                <!-- 指定日志使用的输出端处理器 -->
                <AppenderRef ref="Console"></AppenderRef>
                <AppenderRef ref="rollingFile"></AppenderRef>
            </Root>
        </Loggers>
    </Configuration>
    ```
