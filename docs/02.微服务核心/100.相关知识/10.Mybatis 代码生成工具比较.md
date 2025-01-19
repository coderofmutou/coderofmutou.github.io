---
title: Mybatis 代码生成工具比较
date: 2024-05-02 17:41:37
permalink: /pages/20b7dd/
categories:
  - 微服务核心
  - 相关知识
tags:
  - 
author: 
  name: bombax
  link: https://github.com/coderofmutou
---
# Mybatis-generator、通用 Mapper 与 Mybatis-Plus 对比

## [Mybatis-generator](https://mybatis.org/generator/index.html)

**简介：**

- Mybatis-generator 是一个基于 MyBatis 和 Velocity 的代码生成器，它可以为 MyBatis 和 iBATIS 生成 SQL Map、Java Model 和 Java Mapper。
- 开发者只需配置好数据库连接和生成规则，就可以自动生成大量的基础代码，从而大大减少了手动编写 SQL Map、Model 和 Mapper 的工作量。

**优点：**

- 自动生成大量基础代码，提高开发效率。
- 支持多种数据库。
- 可以通过配置文件灵活定制生成规则。

**缺点：**

- 生成的代码可能不完全符合开发者的需求，需要进一步的修改和优化。
- 不提供额外的功能，如分页、性能分析等。

**实战应用建议：**

- 在项目初期，使用 Mybatis-generator 快速生成基础代码，加速开发进程。
- 在代码生成后，根据实际需求进行必要的修改和优化。
- Mybatis-generator 使用较为简单，生成的 DAO 类及映射文件中包含基本的 CRUD 操作。需要注意的是，在一次项目中避免多次执行 mybatis-generator，即应当尽量在数据库表建立完整并且确定不会修改之后执行 mabatis-generator，否则再次执行会覆盖原本的 Model、DAO 和映射文件的文件夹（坑）。

## [通用 Mapper](https://github.com/abel533/Mapper/wiki)

**简介：**

- [MyBatis 为什么需要通用 Mapper ?](https://blog.csdn.net/isea533/article/details/83045335)
- 当数据库字段变化频繁时，使用 MBG(mybatis-generator)会带来大量的重构工作，对此，通用 Mapper 给出的解决办法是：给予开发者一个具备丰富的单表方法并且容易扩展的通用的 Mapper。
- 通用 Mapper 是一个基于 MyBatis 的通用 Mapper 接口，它提供了一套通用的 CRUD 操作方法，使得开发者无需编写 Mapper.xml 文件，只需继承通用 Mapper 接口，即可实现数据库的增删改查操作，同时它还允许开发人员便捷地对通用 Mapper 进行扩展。
- 通用 Mapper 的代码生成实际上是使用了 MGB，因此通用 Mapper 的代码生成器只是调用了 MGB，然后在这个基础上加入了一些元素来方便开发。
- 通用 Mapper 同样有 Example 的设计，与 MGB 不同的是，MDB 会对每一个表生成对应的 Example 类，而通用 Mapper 提供了一个统一的 Example 类，这个类和 MBG 生成的相比，需要自己设置属性名，这个类还额外提供了更多的方法。
- 通用 Mapper 可以看作是 MGB 的改进和扩展，一定程度上解决了使用 MGB 重构的问题。
- [下一代 通用 Mapper5](https://mapper.mybatis.io/)。

**优点：**

- 简化了 Mapper 的编写，减少了大量的重复代码。
- 支持多种条件查询和排序。
- 提供了分页功能。

**缺点：**

- 对于复杂的 SQL 查询，可能需要编写自定义的 Mapper 方法。
- 灵活性相对较低，可能无法满足所有项目的需求。

**实战应用建议：**

- 在项目中，对于简单的 CRUD 操作，可以使用通用 Mapper 来减少代码量。
- 对于复杂的查询需求，可以结合自定义 Mapper 方法来实现。

## Mybatis-Plus

**简介：**

- Mybatis-Plus 是一个强大的 MyBatis 扩展插件，它不仅提供了通用的 CRUD 操作，还增加了许多实用的功能，如分页、性能分析、乐观锁等。
- 同时，Mybatis-Plus 还提供了许多实用的注解和工具类，使得开发者能够更加方便地进行数据库操作。
- Mybatis-Plus 是 Mybatis 的增强工具（MBG 和通用 Mapper 可看成插件），在 Mybatis 的基础上增加了很多功能，简化开发，提高效率。
- 与 MBG 不同，使用 Mybatis-Plus 自动生成代码需要编写代码，通过调用 AutoGenerator 类实现代码生成，从这方面来说不如使用插件方便。但是它丰富的功能以及只是相对复杂的配置还是使它领先于 MBG 以及通用 Mapper。

**优点：**

- 提供了丰富的功能，如分页、性能分析等。
- 支持多种条件查询和排序。
- 提供了注解和工具类，简化了开发过程。

**缺点：**

- 相对于通用 Mapper，Mybatis-Plus 的学习成本可能更高一些。
- 在某些情况下，可能需要进行一些额外的配置和定制。

**实战应用建议：**

- 在项目中，如果需要更多的功能和灵活性，可以考虑使用 Mybatis-Plus。
- 结合 Mybatis-Plus 提供的注解和工具类，提高开发效率和质量。

## 功能对比

|            | Mybatis-generator                                            | 通用 Mapper                                                   | Mybatis-Plus                                                 |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 代码生成器 | 支持自动生成 Model,Mapper,Mapper XML 文件<br/><br/>生成方式不够灵活；<br/><br/>生成代码功能较为简单 | 支持自动生成 Entity,Mapper,Mapper XML 文件；<br/><br/>提供通用的 Mapper 模板，生成方式较灵活；<br/><br/>生成的 Model 文件包含注释能够很好地与数据库表完成映射 | 支持自动生成 Entity,Mapper,Mapper XML,Service,Controller 文件；<br/><br/>提供 BaseMapper 接口 |
| CRUD 操作   | 代码生成后每个 Mapper 有固定的 CRUD 方法；<br/><br/>在每个 Mapper 上分别扩展 | 提供通用 Mapper 接口；<br/><br/>可以扩展通用接口               | 提供 BaseMapper 接口；<br/><br/>可以扩展通用接口               |
| 条件构造器 | 每个实体类自己的 Example 构造条件                              | 提供通用 Example                                              | 提供 Wrapper 进行复杂条件构造                                  |
| 乐观锁     |                                                              | 支持                                                         | 支持                                                         |
| 主键策略   |                                                              |                                                              | 支持                                                         |
| 性能分析   |                                                              |                                                              | 支持                                                         |

## 总结

Mybatis-generator、通用 Mapper 和 Mybatis-Plus 都是 Java 持久层框架中非常有用的工具。在选择时，开发者需要根据项目的实际需求和个人偏好来进行权衡。在项目初期，可以使用 Mybatis-generator 快速生成基础代码；对于简单的 CRUD 操作，可以使用通用 Mapper 来减少代码量；如果需要更多的功能和灵活性，可以考虑使用 Mybatis-Plus。无论选择哪个工具，都需要结合项目的实际情况进行定制和优化，以达到最佳的开发效果。

通用 Mapper 是对 Mybatis-generator 的升级改造，解决了使用 Mybatis-generator 可能需要大量重构的问题，并且在这个基础上加入了一些新的功能。Mybatis-Plus 可以看作是在另一个方向上对 Mybatis 的升级改造，不仅能够根据数据库表快速生成 pojo 实体类，还封装了大量 CRUD 方法，使用 Wrapper 解决了复杂条件构造等问题，更是根据开发中常见的问题给出了一系列解决方案。



## 参考文件

- 各官方文档
- [Mybatis-generator/通用 Mapper/Mybatis-Plus 对比_通用 mapper mybatis 区别](https://blog.csdn.net/m0_37524586/article/details/88351833)
- [Mybatis-generator、通用 Mapper 与 Mybatis-Plus：深入比较与实战应用)](https://cloud.baidu.com/article/3274037)

