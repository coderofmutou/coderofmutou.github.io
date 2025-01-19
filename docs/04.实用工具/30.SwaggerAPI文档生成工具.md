---
title: Swagger API 文档生成工具
date: 2024-08-21 01:35:36
permalink: /tools/swagger/
categories:
  - 实用工具
tags:
  - 
author: 
  name: bombax
  link: https://github.com/coderofmutou
---
# Swagger API 文档生成工具

## SpringFox 工具（不推荐）

　　Springfox 是一套可以帮助 Java 开发者自动生成 API 文档的工具，它是基于 Swagger 2.x 基础上开发的。Swagger 已经成为了 RESTful API 文档生态系统的事实标准，而**Springfox 是一个用于集成 Swagger2.x 到 Spring 应用程序中的库**。而且 Springfox**提供了一些注解**来描述 API 接口、参数和返回值，并根据这些信息**生成 Swagger UI 界面**，从而方便其他开发人员查看和使用您的 API 接口。此外，Springfox 还支持自动生成 API 文档和代码片段，简化了开发人员的工作量。除了集成 Swagger 2.x，Springfox 还提供了一些额外功能，例如自定义 Swagger 文档、API 版本控制、请求验证等等。这些功能使得 Springfox 可以胜任各种类型和规模的应用程序，同时还可以提高代码质量和开发效率。总之，Springfox 是一个非常有用的工具，它可以帮助 Java 开发者快速、简单地集成 Swagger2.x，并为他们的应用程序生成高质量的 API 文档。无论您开发的是大型企业应用程序还是小型服务，使用 Springfox 都能够提高团队的生产力和代码质量。

**注意**：但是随着时间的推移，Swagger2.x 终究成为历史，所以我们可以看出 springfox-boot-starter 的坐标从 3.0.0 版本（2020 年 7 月 14 日）开始就一直没有更新；也得注意的是 springfox-swagger2 坐标和 springfox-boot-start 是一样的，但 springfox-boot-start 只有 3.0.0 版本。**这里我就不在使用 Swagger2.x 版本**，具体可以在网上找到许多，因为大部分的网上资料都是 Swagger2.x 的方式。

### Swagger 是什么

Swagger 是一个用于生成、描述和调用 RESTful 接口的 Web 服务。通俗的来讲，Swagger 就是将项目中所有（想要暴露的）接口展现在页面上，并且可以进行接口调用和测试的服务。

Swagger 官网地址：[https://swagger.io/](https://link.segmentfault.com/?enc=PClYLc10HvqyJ5LEWzn9VA%3D%3D.KCDlXtJv0IRKw2VeulJXQX054AHPrI7hoGQZ24jp0Y4%3D)

### Swagger 有什么用

1. **将项目中所有的接口展现在页面上**，这样后端程序员就不需要专门为前端使用者编写专门的接口文档；
2. 当接口更新之后，只需要修改代码中的 Swagger 描述就可以实时生成新的接口文档了，从而**规避了接口文档老旧不能使用的问题**；
3. 通过 Swagger 页面，我们可以**直接进行接口调用，降低了项目开发阶段的调试成本**。

### Swagger 旧版本使用

Swagger 旧版本也就是目前市面上主流的 V2 版本是 Swagger 2.9.2。

使用步骤：

1. 添加依赖
2. 开启 Swagger 功能
3. 配置 Swagger 文档摘要信息
4. 调用接口访问

#### 添加依赖

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>

<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
```

#### 开启 Swagger

在 Spring Boot 的启动类或配置类中添加 `@EnableSwagger2` 注释，开启 Swagger。

#### 配置摘要信息

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2) // 1.SWAGGER_2
            // 通过.select()方法，去配置扫描接口
            .select()
            // //RequestHandlerSelectors配置如何扫描接口
            .apis(RequestHandlerSelectors.basePackage("com.example.swaggerv2.controller")) // 2.设置扫描路径
            .build();
    }
}
```

 Swagger 文档中大概有这四类信息

- 组
- 基本信息
- 接口信息
- 实体类信息

#####  配置基本信息

Swagger 有自己的实例 Docket，如果我们想要自定义基本信息，可以使用 docket 来配置 swagger 的基本信息，基本信息的设置在 `ApiInfo` 这个对象中。

```java
// 基本信息设置
private ApiInfo apiInfo() {
    Contact contact = new Contact(
        "aaa", // 作者姓名
        "https://bbb", // 作者网址
        "ccc@163.com"); // 作者邮箱
    return new ApiInfoBuilder()
        .title("aaa-接口文档") // 标题
        .description("bbb") // 描述
        .termsOfServiceUrl("https://www.aaa.com") // 跳转连接
        .version("1.0") // 版本
        .license("Swagger-的使用(详细教程)")
        .licenseUrl("https://www.apache.org/licenses/LICENSE-2.0")
        .contact(contact).build();
}
```

##### 配置接口信息

默认情况下，Swagger 是会展示所有的接口信息的，包括最基础的 `basic-error` 相关的接口。

有时候我们希望不要展示 `basic-error-controller` 相关的接口，或者是说这想要显示某些接口，这个时候就需要设置 `扫描接口`

```java
@Bean
public Docket docket() {
    // 创建一个 swagger 的 bean 实例
    return new Docket(DocumentationType.SWAGGER_2)
        // 配置接口信息
        .select() // select()函数返回一个ApiSelectorBuilder实例,用来控制接口被swagger做成文档
        // 配置如何扫描接口
        .apis(RequestHandlerSelectors.basePackage("com.aaa.bbb.controller") // 扫描指定包下的接口，最为常用
//                                .any() // 扫描全部的接口，默认
//                                .none() // 全部不扫描
//                                .withClassAnnotation(RestController.class) // 扫描带有指定注解的类下所有接口
//                                .withMethodAnnotation(PostMapping.class) // 扫描带有指定注解的方法接口
                )
        // 选择所有的API,如果你想只为部分API生成文档，可以配置这里
        .paths(PathSelectors.any() // 满足条件的路径，该断言总为true
//                                .none() // 不满足条件的路径，该断言总为false（可用于生成环境屏蔽 swagger）
//                                .ant("/user/**") // 满足字符串表达式路径
//                                .regex("") // 符合正则的路径
                )
        .build().apiInfo(apiInfo()); // 配置基本信息
}
```

##### 配置分组信息

Swagger 默认只有一个 default 分组选项，如果没有设置，所有的接口都会显示在 `default` 分组下，如果功能模块和接口数量一多，就会显得比较凌乱，不方便查找和使用。

swagger 文档中组名默认是 default，可通过 `groupName(String)` 修改。

如果需要配置多个组的话，就需要配置多个 `docket() 方法`：

```java
/**
* 展示 controller 包下所有的接口
*/
@Bean
public Docket docket1() {
    // 创建一个 swagger 的 bean 实例
    return new Docket(DocumentationType.SWAGGER_2)
        .groupName("a") // 修改组名为 "a"
        // 配置接口信息
        .select() // 设置扫描接口
        // 配置如何扫描接口
        .apis(RequestHandlerSelectors.basePackage("com.aaa.bbb.controller")) // 扫描指定包下的接口，最为常用  
        .paths(PathSelectors.any()).build(); // 满足条件的路径，该断言总为true          
}

/**
* 展示路径为 /error 的所有接口（基础接口）
*/
@Bean
public Docket docket2() {
    // 创建一个 swagger 的 bean 实例
    return new Docket(DocumentationType.SWAGGER_2)
        .groupName("b") // 修改组名为 "b"
        // 配置接口信息
        .select() // 设置扫描接口
        // 配置如何扫描接口
        .apis(RequestHandlerSelectors.any()) // 扫描全部的接口，默认
        .paths(PathSelectors.ant("/error")) // 满足字符串表达式路径        
        .build();
}
```

#### 访问 Swagger

项目正常启动之后使用 `http://localhost:8080/swagger-ui.html` 访问 Swagger 页面

### Swagger UI 增强

1. 可能会觉得现在这个 UI 不是很好看，现在有一些第三方提供了一些 Swagger UI 增强，比较流行的是`swagger-bootstrap-ui`

```xml
<!-- swagger的两个依赖包也要引入-->
<!-- 引入swagger-bootstrap-ui依赖包-->
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>swagger-bootstrap-ui</artifactId>
    <version>1.8.7</version>
</dependency>
```

2. 在 swagger 配置类中增加注解 `@EnableSwaggerBootstrapUI`:

```java
@Configuration // 标明是配置类
@EnableSwagger2 //开启swagger功能
@EnableSwaggerBootstrapUI // 开启SwaggerBootstrapUI
public class SwaggerConfig {
    // 省略配置内容
}
```

3. 访问 API：`http://localhost:8080/doc.html`，即可预览到基于 bootstarp 的 Swagger UI 界面。

### Swagger 最新版使用

Swagger 最新版的配置步骤和旧版本是一样，只是每个具体的配置项又略有不同，具体步骤如下。

#### 添加依赖

```xml
<dependency>
  <groupId>io.springfox</groupId>
  <artifactId>springfox-boot-starter</artifactId>
  <version>3.0.0</version>
</dependency>
```

从上述配置可以看出，Swagger 新版本的依赖项只有一个，而旧版本的依赖项有两个，相比来说也简洁了很多。

#### 开启 Swagger

在 Spring Boot 的启动类或配置类中添加 `@EnableOpenApi` 注释，开启 Swagger。

#### 配置摘要信息

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.oas.annotations.EnableOpenApi;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@EnableOpenApi
public class SwaggerConfig {
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.OAS_30) // v2 不同
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.example.swaggerv3.controller")) // 设置扫描路径
                .build();
    }
}
```

从上述代码可以看出 `Docket` 的配置中只有文档的类型设置新老版本是不同的，新版本的配置是 `OAS_30` 而旧版本的配置是 `SWAGGER_2`。

> PS：OAS 是 OpenAPI Specification 的简称，翻译成中文就是 OpenAPI 说明书。

#### 访问 Swagger

新版本的 Swagger 访问地址和老版本的地址是不同的，新版版的访问地址是 `http://localhost:8080/swagger-ui/`。

### 新版本 VS 老版本

1. 依赖项的添加不同：新版本只需要添加一项，而老版本需要添加两项；
2. 启动 Swagger 的注解不同：新版本使用的是 `@EnableOpenApi`，而老版本是 `@EnableSwagger2`；
3. `Docket`（文档摘要信息）的文件类型配置不同：新版本配置的是 `OAS_3`，而老版本是 `SWAGGER_2`；
4. Swagger UI 访问地址不同：新版本访问地址是 `http://localhost:8080/swagger-ui/`，而老版本访问地址是 `http://localhost:8080/swagger-ui.html`。



Swagger 新版本让人印象深刻的优点有两个：第一，配置变得简单了，比如依赖项配置减少了 50%，第二，新版 Swagger 页面设计风格有了不小的改变，新版的页面让人感觉更加现代化也更加具有科技感了，总体来说美观了不少。

值得一提的是 Swagger 的整个升级过程很平滑，从老版本升级到新版本，只需要简单的配置即可，那些用于描述接口的注解还是延续了老版本的用法，这样就可以在不修改大部分主要代码的情况下，可以成功到最新版本。

### 常见异常

1. `org.springframework.context.ApplicationContextException: Failed to start bean 'documentationPluginsBootstrapper'; nested exception is java.lang.NullPointerException`
2. `Failed to start bean 'documentationPluginsBootstrapper`
3. `Caused by: java.lang.NullPointerException: null`

原因：使用 **Spring Boot 2.6(7).x 及以上**版本时，**Swagger 2.9.2** 会有一些**兼容性问题**

解决方法：

1. SpringBoot 2.6(7).x 以下 + Swagger-ui 和 Swagger2 2.9.2

2. SpringBoo 2.6(7).x 往上 + springfox-boot-starter（3.0.0 包括 Swagger-ui 和 Swagger2 3.0）

3. 修改配置

    ```yml
    # Spring Boot 2.6.X版本引入了新的路径匹配策略，这导致了与Springfox的不兼容。
    # Spring Boot使用PathPatternMatcher作为默认的路径匹配策略，而Springfox依赖于
    # AntPathMatcher。所以做以下修改：
    spring:
      mvc:
        pathmatch:
          matching-strategy: ant_path_matcher
    ```

4. springfox-boot-starter 3.0.0 可以不更改配置，而是注入 bean

    ```java
    @Bean
    public static BeanPostProcessor springfoxHandlerProviderBeanPostProcessor() {
        return new BeanPostProcessor() {
    
            @Override
            public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
                if (bean instanceof WebMvcRequestHandlerProvider || bean instanceof WebFluxRequestHandlerProvider) {
                    customizeSpringfoxHandlerMappings(getHandlerMappings(bean));
                }
                return bean;
            }
    
            private <T extends RequestMappingInfoHandlerMapping> void customizeSpringfoxHandlerMappings(List<T> mappings) {
                List<T> copy = mappings.stream()
                        .filter(mapping -> mapping.getPatternParser() == null)
                        .collect(Collectors.toList());
                mappings.clear();
                mappings.addAll(copy);
            }
    
            @SuppressWarnings("unchecked")
            private List<RequestMappingInfoHandlerMapping> getHandlerMappings(Object bean) {
                try {
                    Field field = ReflectionUtils.findField(bean.getClass(), "handlerMappings");
                    field.setAccessible(true);
                    return (List<RequestMappingInfoHandlerMapping>) field.get(bean);
                } catch (IllegalArgumentException | IllegalAccessException e) {
                    throw new IllegalStateException(e);
                }
            }
        };
    }
    ```

## SpringDoc 工具（推荐）

**SpringDoc 对应坐标是 `springdoc-openapi-ui`**，它是一个集成 Swagger UI 和 ReDoc 的接口文档生成工具，在使用上与 `springfox-boot-starter` 类似，但提供了更为灵活、功能更加强大的工具。其中除了可以生成 Swagger UI 风格的接口文档，还提供了 ReDoc 的文档渲染方式，可以自动注入 OpenAPI 规范的 JSON 描述文件，支持 OAuth2、JWT 等认证机制，并且**支持全新的 OpenAPI 3.0 规范**。

　**SpringDoc 是基于 OpenAPI 3.0 规范构建的，因此推荐在 Spring Boot 2.4 及以上版本中使用 `springdoc-openapi-ui` 库来集成 Swagger3.x。在这些版本中，`springdoc-openapi-ui` 库已被广泛应用，并且得到了社区的大力支持和推广。而在 Spring Boot 2.3 及其以下版本，可以使用 springfox-boot-starter 库来集成 Swagger2.x。**

　　SpringDoc 是有着更加先进的技术架构和更好的扩展性，使得其逐渐取代了 springfox-boot-starter 工具包，成为了当前 Spring Boot 生态中最受欢迎的 API 文档工具之一。同时 `springdoc-openapi-ui` 还拥有更为完善的开发文档和社区支持，从而吸引了越来越多的开发者加入到这个项目中。因此作为一个 Spring Boot 开发者，如果想要快速、方便地生成符合 OpenAPI 3.0 规范的接口文档，建议使用 springdoc-openapi-ui 这个优秀的工具。

[Swagger - 随笔分类 - Code 技术分享 - 博客园 (cnblogs.com)](https://www.cnblogs.com/vic-tory/category/2342927.html)

> 注：Spring Boot 3.0 使用 `springdoc-openapi-starter-webmvc-ui`坐标

### springdoc-openapi-ui

- Spring Boot 2.x.x
- JDK 1.8+

`http://localhost:8080/swagger-ui/index.html`

#### 添加依赖

```xml
<!-- 这个坐标它提供了一组注解和工具来集成Swagger UI和OpenAPI规范等-->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.7.0</version>
</dependency>
```

#### 配置 SpringDocConfig（配置类方式）

> 注：`io.swagger.v3.oas.annotations` 是 Swagger 注解包，而 `io.swagger.v3.oas.models` 是 Swagger 配置类对象方式

```less
OpenAPI对象是Swagger中的核心类之一，用于描述整个API的结构和元数据。可以理解为一个API文档对象，其中包含了许多元素，如：
    ①：openapi属性：
        表示使用的 OpenAPI 规范版本（例如 3.0.1）。
    ②：info属性：
        表示API的基本信息，包括标题、版本号、描述、联系人等。使用Info类来创建这个对象。
    ③：servers属性：
        表示服务器地址或者URL模板列表。每个URL模板可以包含占位符，这些占位符可以被路径参数或者查询参数替换。
        使用Server类来创建这个对象。
    ④：paths属性（推荐使用注解方式，不推荐使用配置类配置）：
        表示API的所有路径和操作信息，使用PathItem类来描述每一个路径，使用Operation类来描述操作。
    ⑤：components属性：
        表示API的组件信息，比如响应模板、请求模板和安全方案等。
        使用Schema、Response、Parameter、SecurityScheme等类来创建这些对象。
    ⑥：tags属性：
        表示API的标签信息，用于对相似的操作进行分组。
    ⑦：addServersItem(Server server)方法：
        向servers属性中添加一个Server对象。
    ⑧：addPaths(String name, PathItem pathItem)方法：
        向paths属性中添加一个PathItem对象，其中name参数表示路径模板。
    ⑨：addTag(Tag tag)方法：
        向tags属性中添加一个Tag对象。
    ⑩：setComponents(Components components)方法：
        设置components属性的值。
```

```java
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Configuration
public class SpringDocConfig {

    @Bean
    public OpenAPI openAPI(){
        // 联系人信息(contact)，构建API的联系人信息，用于描述API开发者的联系信息，包括名称、URL、邮箱等
        Contact contact = new Contact()
                .name("bombax")  // 作者名称
                .email("aa@qq.com") // 作者邮箱
                .url("https://aa.com/") // 介绍作者的URL地址
                .extensions(new HashMap<String,Object>());// 使用Map配置信息（如key为"name","email","url"）

        License license = new License()
                .name("Apache 2.0")                         // 授权名称
                .url("https://www.apache.org/licenses/LICENSE-2.0.html")    // 授权信息
                .identifier("Apache-2.0")                   // 标识授权许可
                .extensions(new HashMap<String, Object>());// 使用Map配置信息（如key为"name","url","identifier"）

        //创建Api帮助文档的描述信息、联系人信息(contact)、授权许可信息(license)
        Info info = new Info()
                .title("Api接口文档标题")      // Api接口文档标题（必填）
                .description("项目描述")     // Api接口文档描述
                .version("1.0.0")                                  // Api接口版本
                .termsOfService("https://www.aa.com/")    // Api接口的服务条款地址
                .license(license)  //   授权名称                                
                .contact(contact); // 设置联系人信息

        List<Server>  servers = new ArrayList<>(); //多服务
        // 表示服务器地址或者URL模板列表，多个服务地址随时切换（只不过是有多台IP有当前的服务API）
        servers.add(new Server().url("http://localhost:8080").description("服务1"));
        servers.add(new Server().url("http://localhost:8081").description("服务2"));

        // // 设置 spring security apikey accessToken 认证的请求头 X-Token: xxx.xxx.xxx
        SecurityScheme securityScheme = new SecurityScheme()
                .name("x-token")
                .type(SecurityScheme.Type.APIKEY)
                .description("APIKEY认证描述")
                .in(SecurityScheme.In.HEADER);

        // 设置 spring security jwt accessToken 认证的请求头 Authorization: Bearer xxx.xxx.xxx
        SecurityScheme securityScheme1 = new SecurityScheme()
                .name("JWT认证")
                .scheme("bearer") //如果是Http类型，Scheme是必填
                .type(SecurityScheme.Type.HTTP)
                .description("认证描述")
                .in(SecurityScheme.In.HEADER)
                .bearerFormat("JWT");

        List<SecurityRequirement> securityRequirements = new ArrayList<>();

        SecurityRequirement securityRequirement = new SecurityRequirement();
        securityRequirement.addList("authScheme");

        securityRequirements.add(securityRequirement);

        // 返回信息
        return new OpenAPI()
                //.openapi("3.0.1")  // Open API 3.0.1(默认)
                .info(info)
                .servers(servers)
                .components(new Components().addSecuritySchemes("authScheme",securityScheme1)) //添加鉴权组件
                .security(securityRequirements) //全部添加鉴权小锁
                .externalDocs(new ExternalDocumentation()
                        .description("对外说明") //对外说明
                        .url("https://www.aa.com"));       // 配置Swagger3.0描述信息
    }
}
```

#### 配置 SpringDocConfig（注解方式）

```less
定义Swagger3.0配置信息注解：@OpenAPIDefinition （具体参考 io.swagger.v3.oas.annotations）
注意：这个注解全局只能配置一个，主要配置文档信息和安全配置
    说明：用于描述整个API的元信息和全局属性，可以定义和描述，包括API版本、基本信息、服务器信息、安全方案等
    常用属性：
        ①：info：用于描述 API 基本信息的对象，包括标题、版本号、描述等属性；
        ②：servers：用于描述 API 服务的 URL 和配置信息的数组；
        ③：security：用于描述 API 安全方案的数组，其中每个安全方案包含多个安全需求；
        ④：tags：用于描述 API 标签的数组，每个标签包含名称、描述等属性；
        ⑤：externalDocs：用于描述外部文档链接的对象，包含描述和 URL 两个属性。
```

```java
import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.extensions.Extension;
import io.swagger.v3.oas.annotations.extensions.ExtensionProperty;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;


@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Api接口文档标题",
                description = "项目描述",
                version = "1.0.0",
                termsOfService = "https://www.aa.com/",
                contact = @Contact(
                        name = "robin",                            // 作者名称
                        email = "aaa@gmail.com",                  // 作者邮箱
                        url = "https://www.aa.com"  // 介绍作者的URL地址
                ),
                license = @License(name = "Apache 2.0",
                        url = "http://www.apache.org/licenses",
                        extensions = @Extension(name = "test", properties = @ExtensionProperty(name = "test", value = "1111")))
        ),
        security = @SecurityRequirement(name = "JWT认证"), //全部加上认证
        servers = {
                @Server(url = "http://localhost:8081", description = "服务1"),
                @Server(url = "http://localhost:8080", description = "服务2")
        },
        externalDocs = @ExternalDocumentation(description = "对外说明", url = "https://www.cnblogs.com/vic-tory/")
)
@SecurityScheme(
        name = "JWT认证",                   // 认证方案名称
        type = SecuritySchemeType.HTTP,      // 认证类型，当前为http认证
        description = "这是一个认证的描述详细",  // 描述信息
        in = SecuritySchemeIn.HEADER,        // 代表在http请求头部
        scheme = "bearer",                   // 认证方案，如：Authorization: bearer token信息
        bearerFormat = "JWT")
public class SpringDocConfig2 {
}
```

#### 配置 API 接口信息说明

1. 配置文档标题及归类，就是在 Controller 上配置。

    ```less
    注解：@Tag 可以用于对接口进行分类和归类，便于开发人员组织和管理 API 文档
        具体属性：
            ①：name：表示标签的名称，必填属性，也得注意多个Controller上的name不要写一样的，这样就会把它们归类在一起。
            ②：description：表示标签的描述信息，非必填属性。
            ③：externalDocs：用于指定URL地址文档信息来追加描述接口的信息。非必填属性。
            示例：
                @Tag(name = "用户控制器", description = "用户控制器描述",
                    externalDocs = @ExternalDocumentation(
                    description = "文档接口描述",
                    url = "https://www.aa.com/"))
    ```

2. 配置文档下的每一个接口信息，就是 Controller 里的每一个 RequestMapping

    ```less
    注解：@Operation用于对API操作（即方法）进行描述和标记。就是我们熟知的Controller下的一个个请求的方法上。
        具体可以参考 io.swagger.v3.oas.annotations。
        具体属性：
            ①：summary：用于简要描述API操作的概要。
            ②：description：用于详细描述API操作的描述信息。
            ③：parameters：用于指定API操作的参数列表，包括路径参数、请求参数、请求头部等。可以使用@Parameter注解进一步定义参数。
            ④：operationId：用于指定API操作的唯一标识符，可以用于生成客户端代码或文档等。
                说明：第三方工具使用operationId来唯一标识此操作。（具体我也没用过）
            ⑤：requestBody：用于定义API操作的请求体，可以使用@RequestBody注解进一步定义请求体。
                说明：这里的@RequestBody注解是@io.swagger.v3.oas.annotations.parameters.RequestBody包里的
            ⑥：responses：用于定义 API 操作的响应列表，包括成功响应和错误响应。可以使用@ApiResponse注解进一步定义响应。
            ⑦：security：用于对API操作进行安全控制，可以使用@SecurityRequirement注解进一步定义安全需求。（下个章节具体说）
            ⑧：deprecated：表示该API操作已经过时或不推荐使用。
            @Operation(
                summary = "根据用户标识号查询用户信息",
                description = "根据用户标识号查询用户信息，并返回响应结果信息",
    //            security = @SecurityRequirement(name = "authScheme"), //定义单个认证
                parameters = {
                        @Parameter(name = "id", description = "用户标识号", required = true, example = "1")
                },
                responses = {
                        @ApiResponse(
                                responseCode = "200",
                                description = "响应成功",
                                content = @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(
                                                title = "ApiResult和User组合模型",
                                                description = "返回实体，ApiResult内data为User模型",
                                                anyOf = {ApiResult.class, User.class}),
                                        examples = @ExampleObject(
                                                name = "返回示例",
                                                summary = "返回示例",
                                                value =
                                                        "{\n" +
                                                                "  \"code\": 0,\n" +
                                                                "  \"msg\": \"操作成功\",\n" +
                                                                "  \"data\": {},\n" +
                                                                "  \"isSuccess\": true\n" +
                                                                "}"
                                        )
                                )
                        ),
    ```

3. 配置请求接口参数信息

    ```less
    注解：@Parameter用于描述HTTP请求的参数信息，它是一个Parameter[]类型的数组，每个元素表示一个请求参数；
        具体参考：io.swagger.v3.oas.annotations；它是一个注解，和Parameter类一样，只不过一个是注解一个是类的方式
            ①：name：参数名称。
            ②：in：参数位置，可以是 query、header、path、cookie 等。
            ③：description：参数描述。
            ④：required：参数是否必须，默认为 false。
            ⑤：deprecated：参数是否已过时，默认为 false。
            ⑥：allowEmptyValue：是否允许空值，默认为false。
            ⑦：style：参数的序列化风格，可以是 "matrix"、"label"、"form"、"simple"、
                "spaceDelimited"、"pipeDelimited"、"deepObject"；
            ⑧：explode：当参数值是对象或数组时，是否将其展开成多个参数，默认为 false。
            ⑨：schema：参数类型和格式的定义，通常使用@Schema注解。（下面介绍）
            ⑩：example：参数值的示例；
            示例：
                parameters = {
                        @Parameter(name = "id", description = "用户标识号", required = true, example = "1")
                },
    ```

4. 配置具体的实体模型信息

    ```less
    注解：@Schema 是用于描述数据模型的基本信息和属性，具体可以参考“io.swagger.v3.oas.annotations.media”
        具体属性：
            ①：description：用于描述该类或属性的作用。
            ②：name：指定属性名。该属性只对属性有效，对类无效。
            ③：title：用于显示在生成的文档中的标题。
            ④：requiredMode：用于指定该属性是否必填项。枚举Schema.RequiredMode内可选值如下：
                默认AUTO：可有可无；REQUIRED：必须存在此字段(会加红色*)；NOT_REQUIRED：不需要存在此字段
            ⑤：accessMode：用于指定该属性的访问方式。
                包括AccessMode.READ_ONLY（只读）、AccessMode.WRITE_ONLY（只写）、AccessMode.READ_WRITE（读写）
            ⑥：format：用于指定该属性的数据格式。例如：日期格式、时间格式、数字格式。
            ⑦：example：为当前的属性创建一个示例的值，后期测试可以使用此值。
            ⑧：deprecated：用于指定该属性是否为已过时的属性，默认为false。
            ⑨：defaultValue：用于指定该属性的默认值。
            ⑩：implementation：用于显示为该类或属性引入具体的实体路径，这代表当前指定的类或者属性将参考引入的实体。
                就是说有个实体类，这个类里面有个teacher属性，这时里面的teacher属性可以指定具体的实体类，如下：
                public class Student {
                    ...
                    @Schema(description = "老师信息",implementation = Teacher.class)
                    private Teacher teacher;
                    ...
                }
        其它属性：
            ①：type：用于指定数据类型（Data Type）或者元素类型（Element Type）
                基本类型：取值为相应的 Java 类型名，例如 int、long、float、double、boolean 等。
                包装类型：与基本类型相同，取值为相应的Java包装类型名，例如Integer、Long、Float、Double、Boolean等。
                字符串类型：取值为string。
                数组类型：取值为 array。对于数组类型，还可以使用 schema 属性指定其元素类型的 Schema 信息。
                对象类型：不用指定type，可以通过implementation属性引入。
                枚举类型：取值为enum。对于枚举类型，还需要使用enumAsRef属性指定是否将其定义为一个独立的引用类型。
                其它类型：不用指定type，可以通过implementation属性引入。
    
    @Schema注解：提供了四个属性来描述复杂类型，分别是allOf、anyOf、oneOf和not。
        这四个属性可以用于组合不同的JSON Schema以描述一个复杂类型，具体如下：
        ①：allOf: 表示当前schema是多个其它schema的并集。
            例如，如果一个Java类型同时实现了两个接口，那么可以使用allOf来表示这个Java类型继承了这两个接口的所有属性和方法。
        ②：anyOf: 表示当前schema可以匹配其中任意一个schema，其本身也是一个组合体，可以嵌套使用。
            例如，一个返回类型可能是多个Java类型中的任意一个，可以使用anyOf来描述这种情况。
        ③：oneOf: 表示当前schema只能匹配其中一个schema，其本身也是一个组合体，可以嵌套使用。
            例如，一个Java类型只能是多个子类型中的任意一个，可以使用oneOf来描述这种情况。
        ④：not: 表示当前Schema不能匹配某个schema。
            例如，一个Java类型不能是某个子类型，可以使用not来描述这种情况。
        但是总感觉这个Swagger无法满足我特定要求的实体，具体解决如下：
            比如我现在有个AjaxResult类（code，msg，data），其中data为Object或其它类型，这时我返回的数据里data为其它类型的
            实体，所以我这里不理解如何返回的实体中，通过点击data而显示另外实体，我只能通过anyOf方式来实现（加上注解）
             @ApiResponse(
                                responseCode = "200",
                                description = "响应成功",
                                content = @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(
                                                title = "ApiResult和User组合模型",
                                                description = "返回实体，ApiResult内data为User模型",
                                                anyOf = {ApiResult.class, User.class}),
                                        examples = @ExampleObject(
                                                name = "返回示例",
                                                summary = "返回示例",
                                                value =
                                                        "{\n" +
                                                                "  \"code\": 0,\n" +
                                                                "  \"msg\": \"操作成功\",\n" +
                                                                "  \"data\": {},\n" +
                                                                "  \"isSuccess\": true\n" +
                                                                "}"
                                        )
                                )
                        ),
    
    ```

#### 配置 API 接口信息示例

1. 通用返回对象定义

    ```java
    // 响应对象模型定义
    @Data
    @AllArgsConstructor
    @Schema(description = "响应返回数据对象")
    public class ApiResult {
    
        @Schema(
                title = "code",
                description = "响应码",
                format = "int32",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        private Integer code;
    
        @Schema(
                title = "msg",
                description = "响应信息",
                accessMode = Schema.AccessMode.READ_ONLY,
                example = "操作成功",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        private String msg;
    
        @Schema(title = "data", description = "响应数据", accessMode = Schema.AccessMode.READ_ONLY)
        private Object data;
    
        @Schema(title = "isSuccess",
                description = "是否成功",
                accessMode = Schema.AccessMode.READ_ONLY,
                format = "boolean",
                requiredMode = Schema.RequiredMode.REQUIRED)
        private Boolean isSuccess;
    
        public static ApiResult success(Object data) {
            return new ApiResult(1, "操作成功", data, true
            );
        }
    
        public static ApiResult fail(String msg) {
            return new ApiResult(0, msg, null, false);
        }
    }
    ```

2. 模型定义

    ```java
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Schema(title = "用户实体",description = "用户实体描述")
    public class User {
        @Schema(name = "用户标识号", description = "用户标识号描述", format = "int32", example = "1")
        private Integer id;
        @Schema(name = "用户名", description = "用户名描述", example = "robin")
        private String name;
        @Schema(name = "邮件", description = "邮件描述", example = "code9342@gmail.com")
        private String email;
        @Schema(name = "密码", description = "密码描述", example = "123456")
        private String password;
        @Schema(name = "电话号码", description = "电话号码描述", example = "17873041739")
        private String phone;
    }
    ```

3. 接口定义

    ```java
    @RestController
    @RequestMapping("/user")
    @Tag(name = "用户控制器", description = "用户控制器描述",
            externalDocs = @ExternalDocumentation(
                    description = "文档接口描述",
                    url = "https://www.cnblogs.com/vic-tory/"))
    public class UserController {
        /**
         * 根据ID查询用户信息（单条）
         * @param id
         * @return User
         */
        @GetMapping("/get/{id}")
        @Operation(
                summary = "根据用户标识号查询用户信息",
                description = "根据用户标识号查询用户信息，并返回响应结果信息",
    //            security = @SecurityRequirement(name = "authScheme"), //定义单个认证
                parameters = {
                        @Parameter(name = "id", description = "用户标识号", required = true, example = "1")
                },
                responses = {
                        @ApiResponse(
                                responseCode = "200",
                                description = "响应成功",
                                content = @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(
                                                title = "ApiResult和User组合模型",
                                                description = "返回实体，ApiResult内data为User模型",
                                                anyOf = {ApiResult.class, User.class}),
                                        examples = @ExampleObject(
                                                name = "返回示例",
                                                summary = "返回示例",
                                                value =
                                                        "{\n" +
                                                                "  \"code\": 0,\n" +
                                                                "  \"msg\": \"操作成功\",\n" +
                                                                "  \"data\": {},\n" +
                                                                "  \"isSuccess\": true\n" +
                                                                "}"
                                        )
                                )
                        ),
                        @ApiResponse(
                                responseCode = "500",
                                description = "响应失败",
                                content = @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(
                                                title = "ApiResult和User组合模型",
                                                description = "返回实体，ApiResult内data为null",
                                                implementation = ApiResult.class)
                                )
                        )
                }
        )
        public User get(@PathVariable(value = "id") Integer id) {
            User user = new User();
            user.setId(1);
            user.setName("bbb");
            user.setEmail("aaa@gmail.com");
            user.setPassword("123456");
            user.setPhone("123456789");
            return user;
        }
    }
    ```

#### 配置属性

文档地址：[OpenAPI 3 Library for spring-boot (springdoc.org)](https://springdoc.org/#properties)

```yml
springdoc:
  api-docs:
    enabled: true # 是否开启
    path: '/docs'
  swagger-ui:
    path: ''
```

### springdoc-openapi-starter-webmvc-ui

Spring Boot 3.x 引入 springdoc-openapi （内置 Swagger UI、webmvc-api）

**Swagger：** Swagger 是一种 [Rest](https://so.csdn.net/so/search?q=Rest&spm=1001.2101.3001.7020) API 的表示方式，它是标准的、语言无关的工具，这种表示方式不仅人可读，而且机器也可读。Swagger 提供了一套完整的规范来描述 API 接口，包括请求和响应的数据模型、操作行为等。它通过注解或配置文件的方式与代码集成，以生成 API 文档。

**SpringDoc**： SpringDoc 是基于 OpenAPI 3 规范的，专为 Spring Boot 设计的 API 文档生成工具。它提供了与 Spring Boot 更好的集成，支持 Spring Boot 全系列。SpringDoc 利用 JSR-303 中的注解（如 `@NotNull`、`@Min`、`@Max`、`@Size`等）来描述 API 的参数验证信息。此外，SpringDoc 的接口信息可以通过 JSON 展示，也可以与 Swagger-ui 集成，提供可视化的 API 文档界面。

```xml
<!-- swagger3 调用方式 http://你的主机IP地址:5555/swagger-ui/index.html -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

```yml
server:
  port: 5555

springdoc:
  api-docs:
    enabled: true # 开启OpenApi接口
    path: /v3/api-docs  # 自定义路径，默认为 "/v3/api-docs"
  swagger-ui:
    enabled: true # 开启swagger界面，依赖OpenApi，需要OpenApi同时开启
    path: /swagger-ui/index.html # 自定义路径，默认为"/swagger-ui/index.html"
```

```java
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Swagger3Config {
    @Bean
    public GroupedOpenApi PayApi() {
        return GroupedOpenApi.builder().group("支付微服务模块").pathsToMatch("/pay/**").build();
    }
    @Bean
    public GroupedOpenApi OtherApi() {
        return GroupedOpenApi.builder().group("其它微服务模块").pathsToMatch("/other/**", "/others").build();
    }
    
    @Bean
    public OpenAPI springShopOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Spring Boot 中使用 Swagger UI 构建 RESTful API")
                        .contact(new Contact())
                        .description("AA平台提供的 RESTful API")
                        .version("v1.0.0")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")))
                        .externalDocs(new ExternalDocumentation()
                        .description("外部文档")
                        .url("https://springshop.wiki.github.org/docs"));
    }
}
```

## Springfox 和 SpringDoc 注解对照表

[OpenAPI 3 Library for spring-boot (springdoc.org)](https://springdoc.org/index.html#migrating-from-springfox)

| Springfox                                     | SpringDoc                                                    | 解释说明                           |
| --------------------------------------------- | ------------------------------------------------------------ | ---------------------------------- |
| `@Api`                                        | `@Tag`                                                       | 描述接口信息                       |
| `@ApiIgnore`                                  | `@Parameter(hidden = true)` 或 `@Operation(hidden = true)` 或 `@Hidden` | 隐藏字段                           |
| `@ApiImplicitParam`                           | `@Parameter`                                                 | 描述单个参数                       |
| `@ApiImplicitParams`                          | `@Parameters`                                                | 描述多个参数                       |
| `@ApiModel`                                   | `@Schema`                                                    | 描述数据模型                       |
| `@ApiModelProperty(hidden = true)`            | `@Schema(accessMode = READ_ONLY)`                            | 描述属性，可隐藏                   |
| `@ApiModelProperty`                           | `@Schema`                                                    | 描述属性                           |
| `@ApiOperation(value = "foo", notes = "bar")` | `@Operation(summary = "foo", description = "bar")`           | 描述接口操作，包括标题和注释       |
| `@ApiParam`                                   | `@Parameter`                                                 | 描述接口方法参数                   |
| `@ApiResponse(code = 404, message = "foo")`   | `@ApiResponse(responseCode = "404", description = "foo")`    | 描述接口响应信息，包括状态码和消息 |

## Knife4j

官网：[Knife4j · 集 Swagger2 及 OpenAPI3 为一体的增强解决方案.](https://doc.xiaominfo.com/)

[Swagger 系列：SpringBoot3.x 中使用 Knife4j - Code 技术分享 - 博客园 (cnblogs.com)](https://www.cnblogs.com/vic-tory/p/17773531.html)

- Spring Boot 3
- JDK 17+

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
    <version>4.4.0</version>
</dependency>
```

- Spring Boot 2.4.0~3.0.0

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-openapi2-spring-boot-starter</artifactId>
    <version>4.4.0</version>
</dependency>
```

