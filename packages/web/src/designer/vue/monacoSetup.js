import * as monaco from 'monaco-editor'

const monacoSetup1 = async () => {
  // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  //   ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
  //   noUnusedLocals: false,
  //   noUnusedParameters: false,
  //   allowUnreachableCode: true,
  //   allowUnusedLabels: true,
  //   strict: true,
  // })

  await Promise.all([
    (async () => {
      const [
        // { default: EditorWorker },
        // { default: JsonWorker },
        // { default: CssWorker },
        // { default: HtmlWorker },
        // { default: TsWorker }
        EditorWorker,
        JsonWorker,
        CssWorker,
        HtmlWorker,
        TsWorker
      ] = await Promise.all([
        import('monaco-editor/esm/vs/editor/editor.worker.js'),
        import('monaco-editor/esm/vs/language/json/json.worker.js'),
        import('monaco-editor/esm/vs/language/css/css.worker.js'),
        import('monaco-editor/esm/vs/language/html/html.worker.js'),
        import('monaco-editor/esm/vs/language/typescript/ts.worker.js')
      ])

      console.log(TsWorker, ';;')

      window.MonacoEnvironment = {
        getWorker(_, label) {
          if (label === 'json') return JsonWorker
          if (label === 'css' || label === 'scss' || label === 'less') return CssWorker
          if (label === 'html' || label === 'handlebars' || label === 'razor') return HtmlWorker
          if (label === 'typescript' || label === 'javascript') return TsWorker
          return EditorWorker
        }
      }
    })()
  ])

  return { monaco }
}

const monacoSetup = () => {
  return new Promise(r => {
    r({ monaco })
  })
}

export default monacoSetup
