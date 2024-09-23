## Installation (on windows machine)

### Installation of Node.js from official website.
Link to Node.js website.[https://nodejs.org/en/download/package-manager/current].

Run this commands in Admin mode.
```
    # installs fnm (Fast Node Manager)
    winget install Schniz.fnm

    # configure fnm environment
    fnm env --use-on-cd | Out-String | Invoke-Expression

    # download and install Node.js
    fnm use --install-if-missing 22

    # verifies the right Node.js version is in the environment
    node -v # should print `v22.7.0`

    # verifies the right npm version is in the environment
    npm -v # should print `10.8.2`
```
*** important to restart the machine after installation***

[https://stackoverflow.com/questions/27864040/fixing-npm-path-in-windows-8-and-10]

after installation of node.js 
run this commands

```

npm init 

# output 
#PS C:\Users\devil\Downloads\ubuntu_backup\Personal-Portfolio npm init
#This utility will walk you through creating a package.json file.
#It only covers the most common items, and tries to guess sensible defaults.
#See `npm help init` for definitive documentation on these fields
#and exactly what they do.
#Use `npm install <pkg>` afterwards to install a package and
#save it as a dependency in the package.json file.
#
#Press ^C at any time to quit.
#package name: (personal-portfolio)
#version: (1.0.0)
#description:
#entry point: (index.js)
#test command:
#git repository:
#keywords:
#author:
#license: (ISC)
#About to write to C:\Users\devil\Downloads\ubuntu_backup\Personal-Portfolio\package.json:
#
#{
#  "name": "personal-portfolio",
#  "version": "1.0.0",
#  "description": "Building my personal portfolio",
#  "main": "index.js",
#  "scripts": {
#    "test": "echo \"Error: no test specified\" && exit 1"
#  },
#  "author": "",
#  "license": "ISC"
#}
#
#
#Is this OK? (yes)
```

```

npm install create-next-app
#PS C:\Users\devil\Downloads\ubuntu_backup\Personal-Portfolio> npm install create-next-app
#added 1 package, and audited 2 packages in 2s
#found 0 vulnerabilities
```
```
npx create-next-app@latest
#
#PS C:\Users\devil\Downloads\ubuntu_backup\Personal-Portfolio> npx create-next-app@latest   
#√ What is your project named? ... personal-portfolio-of-sathish
#√ Would you like to use TypeScript? ... No / Yes
#√ Would you like to use ESLint? ... No / Yes
#√ Would you like to use Tailwind CSS? ... No / Yes
#√ Would you like to use `src/` directory? ... No / Yes
#? Would you like to use App Router? (recommended) » No / Yes
#PS C:\Users\devil\Downloads\ubuntu_backup\Personal-Portfolio> npx create-next-app@latest 
#√ What is your project named? ... sathish-portfolio-website
#√ Would you like to use TypeScript? ... No / Yes
#√ Would you like to use ESLint? ... No / Yes
#√ Would you like to use Tailwind CSS? ... No / Yes
#√ Would you like to use `src/` directory? ... No / Yes
#√ Would you like to use App Router? (recommended) ... No / Yes
#√ Would you like to customize the default import alias (@/*)? ... No / Yes
#Creating a new Next.js app in C:\Users\devil\Downloads\ubuntu_backup\Personal-Portfolio\sathish-portfolio-website.
#
#Using npm.
#
#Initializing project with template: app-tw
#
#
#Installing dependencies:
#- react
#- react-dom
#- next
#
#Installing devDependencies:
#- react-dom
#- next
#
#Installing devDependencies:
#
#Installing devDependencies:
#- typescript
#- @types/node
#- @types/react
#- @types/react-dom
#- postcss
#- tailwindcss
#- eslint
#- @types/node
#- @types/react
#- @types/react-dom
#- postcss
#- tailwindcss
#- eslint
#- @types/react-dom
#- postcss
#- tailwindcss
#- eslint
#- eslint
#- eslint-config-next
#
#
#npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
#npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
#npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#
#added 362 packages, and audited 363 packages in 1m
#
#136 packages are looking for funding
#  run `npm fund` for details
#
#found 0 vulnerabilities
#Success! Created sathish-portfolio-website at C:\Users\devil\Downloads\ubuntu_backup\Personal-Portfolio\sathish-portfolio-website
#npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#
#added 362 packages, and audited 363 packages in 1m
#
#npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#
#added 362 packages, and audited 363 packages in 1m
#npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#
#added 362 packages, and audited 363 packages in 1m
#
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#
#added 362 packages, and audited 363 packages in 1m
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/config-array@0.11.14: Use @eslint/config-array instead
#npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#
#added 362 packages, and audited 363 packages in 1m
#
#136 packages are looking for funding
#  run `npm fund` for details
#
#found 0 vulnerabilities
#Success! Created sathish-portfolio-website at C:\Users\devil\Downloads\ubuntu_backup\Personal-Portfolio\sathish-portfolio-website
```