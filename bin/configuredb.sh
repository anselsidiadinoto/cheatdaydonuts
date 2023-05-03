#!/bin/bash

echo "Configuring database: cheatday_donuts"

dropdb -U anselsidiadinoto -d cheatday_donuts
createdb -U anselsidiadinoto -d cheatday_donuts

psql -U anselsidiadinoto -d cheatday_donuts < ./bin/sql/cheatday_donuts_db.sql

echo "cheatday_donuts configured"