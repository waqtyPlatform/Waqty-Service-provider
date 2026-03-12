Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('C:\Users\yosse\Hagzy\docx_copy.docx')
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$reader = New-Object System.IO.StreamReader($entry.Open())
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()
$doc = [xml]$xml
$ns = @{w='http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
$paras = Select-Xml -Xml $doc -XPath '//w:p' -Namespace $ns
foreach ($p in $paras) {
    $texts = Select-Xml -Xml $p.Node -XPath './/w:t' -Namespace $ns
    $line = ($texts | ForEach-Object { $_.Node.InnerText }) -join ''
    if ($line.Trim()) { Write-Output $line }
}
