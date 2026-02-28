Get-ChildItem -Path src -Recurse -Filter *.jsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace '([a-zA-Z][a-zA-Z0-9/-]*|/[a-zA-Z][a-zA-Z0-9/-]*)>', '<$1>'
    Set-Content $_.FullName $content
}