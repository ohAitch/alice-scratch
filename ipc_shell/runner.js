#!/usr/bin/env node
  process.stdin.pipe(
    new (require("cbor").Decoder)().on("data",
      (x)=> eval(x.argv[1])
    )
  )

