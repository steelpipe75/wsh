
/* StartComment */
#define TEST_A_A_A TEST_A + TEST_A + 11
#define TEST_A_B_A TEST_A + TEST_B + 11
#define TEST_A_C_A TEST_A + TEST_C + 11

#define TEST_A 11		/* test */
#define TEST_B 0xC		// test
#define TEST_C 071

#define TEST_A_A TEST_A + 11
#define TEST_A_B TEST_B + 11
#define TEST_A_C TEST_C + 11

#define TEST_B_A TEST_B + 0xC
#define TEST_B_B TEST_B + 0xC
#define TEST_B_C TEST_B + 0xC

#define TEST_C_A TEST_C + 071
#define TEST_C_B TEST_C + 071
#define TEST_C_C TEST_C + 071

#define TEST_AA_A TEST_A_A + 11
#define TEST_AB_A TEST_A_B + 11
#define TEST_AC_A TEST_A_C + 11

#define TEST_A_A_P (TEST_A + 11)
#define TEST_A_B_P (TEST_B + 11)
#define TEST_A_C_P (TEST_C + 11)
/* EndComment */
