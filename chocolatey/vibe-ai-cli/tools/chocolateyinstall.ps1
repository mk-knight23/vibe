$ErrorActionPreference = 'Stop'

$packageName = 'vibe-ai-cli'
$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url = 'https://github.com/mk-knight23/vibe/releases/download/v2.1.6/vibe-win.exe'
$checksum = 'placeholder_for_actual_checksum' # Will be updated during release

$packageArgs = @{
  packageName   = $packageName
  unzipLocation = $toolsDir
  fileType      = 'exe'
  url           = $url
  softwareName  = 'vibe-ai-cli*'
  checksum      = $checksum
  checksumType  = 'sha256'
}

Install-ChocolateyPackage @packageArgs