@echo off

echo CACHE MANIFEST>cache.manifest

dir /B /S css\* > list.txt
dir /B /S Data\* >> list.txt
dir /B /S img\* >> list.txt
dir /B /S js\* >> list.txt
dir /B /S res\* >> list.txt
dir /B /S Tabs\* >> list.txt

for /F "tokens=*" %%A in (list.txt) do call :add %%A

del list.txt

goto eof

:add
set astr=%*
IF "%astr%" neq " " (
  set substr1=%CD%\
  set substr2=
  call set result=%%astr:%substr1%=%substr2%%%
  set a=%result:\=/%
  set b=%a: =+%
  echo %b%>>cache.manifest
)
:eof
