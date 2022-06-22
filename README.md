# React Figma Plugin Boilerplate

Boilerplate for easily getting started building custom Figma plugins with React using [react-figma](https://react-figma.dev/).

## Development

Run Development Server:

```bash
yarn dev
```

Open and run the plugin in a local Figma environment:

[Setup Guide](https://www.figma.com/plugin-docs/setup/#go-to-menu-plugins-development-new-plugin)

In development, a separate server is run outside of the Figma plugin which allows utilizing Fast Refresh for preserving editing React state when editing components. Visit the development server to see the plugin in action:

http://localhost:9000//ui.html

Please note, there's a bug right now in the web socket server where it will get stuck and not end the process correctly. [This is a quick guide](https://code2care.org/2015/how-to-kill-service-running-on-port-using-terminal-command) to kill the running port if that happens.

## Acknowledgements

Thank you to the following resources for providing inspiration for this library:

[react-figma boilerplate](https://github.com/react-figma/react-figma-boilerplate)

[How to build Figma plugins 10x faster](https://www.dittowords.com/blog/how-to-build-figma-plugins-10x-faster)
