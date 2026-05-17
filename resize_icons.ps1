$sourceImage = "C:\Users\intel\.gemini\antigravity\brain\deec51d1-1910-4604-b869-349cc0be60c1\fitness_app_icon_1779018794881.png"
$resDir = "D:\Affan\FitnessApp\FitnessApp\android\app\src\main\res"

Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Image]::FromFile($sourceImage)

$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($folder in $sizes.Keys) {
    $size = $sizes[$folder]
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.DrawImage($img, 0, 0, $size, $size)
    
    $outPath1 = Join-Path $resDir "$folder\ic_launcher.png"
    $outPath2 = Join-Path $resDir "$folder\ic_launcher_round.png"
    
    $bmp.Save($outPath1, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save($outPath2, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graph.Dispose()
    $bmp.Dispose()
}

$img.Dispose()
