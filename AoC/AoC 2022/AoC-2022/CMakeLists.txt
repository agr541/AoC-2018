# CMakeList.txt : CMake project for AoC-Cpp, include source and define
# project specific logic here.
#
cmake_minimum_required (VERSION 3.8)

project ("AoC-Cpp")

# Add source to this project's executable.
add_executable (AoC-Cpp   "AoC-2022.cpp" "AoC-2022.h" "Days/Day.cpp" "Days/Day.h" "Days/Day1.cpp" "Days/Day1.h" "Days/Day2.cpp" "Days/Day2.h" "Days/Day3.cpp" "Days/Day3.h" "Days/DayTemplate.cpp" "Days/DayTemplate.h")


if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET AoC-Cpp PROPERTY CXX_STANDARD 20)
endif()

# TODO: Add tests and install targets if needed.
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/Resources
     DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
