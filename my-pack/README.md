在 package.json 中添加 
```
  "bin": {
    "my-pack": "./bin/my-pack.js"
  },
```
然后在当前目录下执行 `sudo npm link` 就可以将当前包链接到全局，在命令输入 `my-pack`，就可以使用这个工具

