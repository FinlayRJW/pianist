\version "2.24.0"

\header {
  title = "Ode to Joy"
  composer = "Ludwig van Beethoven"
}

\score {
  \new PianoStaff <<
    \new Staff = "up" {
      \clef treble
      \key c \major
      \time 4/4
      \tempo "Moderato" 4 = 100
      \relative c' {
        e4 e f g | g f e d |
        c c d e | e4. d8 d2 |
        e4 e f g | g f e d |
        c c d e | d4. c8 c2 |
      }
      \bar "|."
    }
    \new Staff = "down" {
      \clef bass
      \key c \major
      \time 4/4
      \relative c {
        s1 * 8
      }
      \bar "|."
    }
  >>
  \layout { }
  \midi { }
}
