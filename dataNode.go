package pipline_editor

type Stag struct {
	ID      string   `js:"id"`
	Name    string   `js:"name"`
	Actions []Action `js:"actions"`
}

type Action struct {
	ID    string `js:"id"`
	Name  string `js:"name"`
	State string `js:"state"`
	Error bool   `js:"error"`
}
