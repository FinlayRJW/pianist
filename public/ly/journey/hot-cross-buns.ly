\version "2.24.0"

\header {
  title = "Hot Cross Buns"
  composer = "Traditional"
}

\score {
  \new PianoStaff <<
    \new Staff = "up" {
      \clef treble
      \key c \major
      \time 4/4
      \tempo "Allegretto" 4 = 120
      \relative c' {
        e4 d c2 |
        e4 d c2 |
        c8 c c c d d d d |
        e4 d c2 |
      }
      \bar "|."
    }
    \new Staff = "down" {
      \clef bass
      \key c \major
      \time 4/4
      \relative c {
        s1 * 4
      }
      \bar "|."
    }
  >>
  \layout { }
  \midi { }
}
