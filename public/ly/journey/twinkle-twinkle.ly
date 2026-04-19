\version "2.24.0"

\header {
  title = "Twinkle, Twinkle, Little Star"
  composer = "Traditional"
}

\score {
  \new PianoStaff <<
    \new Staff = "up" {
      \clef treble
      \key c \major
      \time 4/4
      \tempo "Moderato" 4 = 100
      \relative c' {
        c4 c g' g | a a g2 |
        f4 f e e | d d c2 |
        g'4 g f f | e e d2 |
        g4 g f f | e e d2 |
        c4 c g' g | a a g2 |
        f4 f e e | d d c2 |
      }
      \bar "|."
    }
    \new Staff = "down" {
      \clef bass
      \key c \major
      \time 4/4
      \relative c {
        s1 * 12
      }
      \bar "|."
    }
  >>
  \layout { }
  \midi { }
}
