package ImageType

const (
	LOGO      = "logo"
	BANNER    = "banner"
	WALLPAPER = "wallpaper"
	PROGRESS  = "progress"
)

func IsImageType(s string) bool {
	switch s {
	case LOGO, BANNER, WALLPAPER, PROGRESS:
		return true
	default:
		return false
	}
}
