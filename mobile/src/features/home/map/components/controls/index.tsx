// controls の公開エクスポートをまとめる。
import { FloorChange } from "./FloorChange";
import { SearchBar } from "./searchBar";
import { UserLocation } from "./userLocation";

export function MapControlsFC() {
  return (
    <>
      <FloorChange />
      <UserLocation />
      <SearchBar />
    </>
  );
}
